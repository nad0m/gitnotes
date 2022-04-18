'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.BindingCall = exports.Page = void 0

var _events = require('./events')

var _utils = require('../utils/utils')

var _timeoutSettings = require('../utils/timeoutSettings')

var _serializers = require('../protocol/serializers')

var _accessibility = require('./accessibility')

var _channelOwner = require('./channelOwner')

var _consoleMessage = require('./consoleMessage')

var _dialog = require('./dialog')

var _download = require('./download')

var _elementHandle = require('./elementHandle')

var _worker = require('./worker')

var _frame = require('./frame')

var _input = require('./input')

var _jsHandle = require('./jsHandle')

var _network = require('./network')

var _fileChooser = require('./fileChooser')

var _buffer = require('buffer')

var _coverage = require('./coverage')

var _waiter = require('./waiter')

var _fs = _interopRequireDefault(require('fs'))

var _path = _interopRequireDefault(require('path'))

var _clientHelper = require('./clientHelper')

var _errors = require('../utils/errors')

var _video = require('./video')

var _artifact = require('./artifact')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Page extends _channelOwner.ChannelOwner {
  static from(page) {
    return page._object
  }

  static fromNullable(page) {
    return page ? Page.from(page) : null
  }

  constructor(parent, type, guid, initializer) {
    super(parent, type, guid, initializer)
    this._browserContext = void 0
    this._ownedContext = void 0
    this._mainFrame = void 0
    this._frames = new Set()
    this._workers = new Set()
    this._closed = false
    this._closedOrCrashedPromise = void 0
    this._viewportSize = void 0
    this._routes = []
    this.accessibility = void 0
    this.coverage = void 0
    this.keyboard = void 0
    this.mouse = void 0
    this.request = void 0
    this.touchscreen = void 0
    this._bindings = new Map()
    this._timeoutSettings = void 0
    this._video = null
    this._opener = void 0
    this._browserContext = parent
    this._timeoutSettings = new _timeoutSettings.TimeoutSettings(
      this._browserContext._timeoutSettings
    )
    this.accessibility = new _accessibility.Accessibility(this._channel)
    this.keyboard = new _input.Keyboard(this)
    this.mouse = new _input.Mouse(this)
    this.request = this._browserContext.request
    this.touchscreen = new _input.Touchscreen(this)
    this._mainFrame = _frame.Frame.from(initializer.mainFrame)
    this._mainFrame._page = this

    this._frames.add(this._mainFrame)

    this._viewportSize = initializer.viewportSize || null
    this._closed = initializer.isClosed
    this._opener = Page.fromNullable(initializer.opener)

    this._channel.on('bindingCall', ({ binding }) =>
      this._onBinding(BindingCall.from(binding))
    )

    this._channel.on('close', () => this._onClose())

    this._channel.on('console', ({ message }) =>
      this.emit(
        _events.Events.Page.Console,
        _consoleMessage.ConsoleMessage.from(message)
      )
    )

    this._channel.on('crash', () => this._onCrash())

    this._channel.on('dialog', ({ dialog }) => {
      const dialogObj = _dialog.Dialog.from(dialog)

      if (!this.emit(_events.Events.Page.Dialog, dialogObj)) {
        if (dialogObj.type() === 'beforeunload')
          dialog.accept({}).catch(() => {})
        else dialog.dismiss().catch(() => {})
      }
    })

    this._channel.on('domcontentloaded', () =>
      this.emit(_events.Events.Page.DOMContentLoaded, this)
    )

    this._channel.on('download', ({ url, suggestedFilename, artifact }) => {
      const artifactObject = _artifact.Artifact.from(artifact)

      this.emit(
        _events.Events.Page.Download,
        new _download.Download(this, url, suggestedFilename, artifactObject)
      )
    })

    this._channel.on('fileChooser', ({ element, isMultiple }) =>
      this.emit(
        _events.Events.Page.FileChooser,
        new _fileChooser.FileChooser(
          this,
          _elementHandle.ElementHandle.from(element),
          isMultiple
        )
      )
    )

    this._channel.on('frameAttached', ({ frame }) =>
      this._onFrameAttached(_frame.Frame.from(frame))
    )

    this._channel.on('frameDetached', ({ frame }) =>
      this._onFrameDetached(_frame.Frame.from(frame))
    )

    this._channel.on('load', () => this.emit(_events.Events.Page.Load, this))

    this._channel.on('pageError', ({ error }) =>
      this.emit(
        _events.Events.Page.PageError,
        (0, _serializers.parseError)(error)
      )
    )

    this._channel.on('route', ({ route, request }) =>
      this._onRoute(_network.Route.from(route), _network.Request.from(request))
    )

    this._channel.on('video', ({ artifact }) => {
      const artifactObject = _artifact.Artifact.from(artifact)

      this._forceVideo()._artifactReady(artifactObject)
    })

    this._channel.on('webSocket', ({ webSocket }) =>
      this.emit(
        _events.Events.Page.WebSocket,
        _network.WebSocket.from(webSocket)
      )
    )

    this._channel.on('worker', ({ worker }) =>
      this._onWorker(_worker.Worker.from(worker))
    )

    this.coverage = new _coverage.Coverage(this._channel)
    this._closedOrCrashedPromise = Promise.race([
      new Promise((f) => this.once(_events.Events.Page.Close, f)),
      new Promise((f) => this.once(_events.Events.Page.Crash, f))
    ])
  }

  _onFrameAttached(frame) {
    frame._page = this

    this._frames.add(frame)

    if (frame._parentFrame) frame._parentFrame._childFrames.add(frame)
    this.emit(_events.Events.Page.FrameAttached, frame)
  }

  _onFrameDetached(frame) {
    this._frames.delete(frame)

    frame._detached = true
    if (frame._parentFrame) frame._parentFrame._childFrames.delete(frame)
    this.emit(_events.Events.Page.FrameDetached, frame)
  }

  _onRoute(route, request) {
    for (const routeHandler of this._routes) {
      if (routeHandler.matches(request.url())) {
        if (routeHandler.handle(route, request)) {
          this._routes.splice(this._routes.indexOf(routeHandler), 1)

          if (!this._routes.length)
            this._wrapApiCall(
              (channel) => this._disableInterception(channel),
              undefined,
              true
            ).catch(() => {})
        }

        return
      }
    }

    this._browserContext._onRoute(route, request)
  }

  async _onBinding(bindingCall) {
    const func = this._bindings.get(bindingCall._initializer.name)

    if (func) {
      await bindingCall.call(func)
      return
    }

    await this._browserContext._onBinding(bindingCall)
  }

  _onWorker(worker) {
    this._workers.add(worker)

    worker._page = this
    this.emit(_events.Events.Page.Worker, worker)
  }

  _onClose() {
    this._closed = true

    this._browserContext._pages.delete(this)

    this._browserContext._backgroundPages.delete(this)

    this.emit(_events.Events.Page.Close, this)
  }

  _onCrash() {
    this.emit(_events.Events.Page.Crash, this)
  }

  context() {
    return this._browserContext
  }

  async opener() {
    if (!this._opener || this._opener.isClosed()) return null
    return this._opener
  }

  mainFrame() {
    return this._mainFrame
  }

  frame(frameSelector) {
    const name = (0, _utils.isString)(frameSelector)
      ? frameSelector
      : frameSelector.name
    const url = (0, _utils.isObject)(frameSelector)
      ? frameSelector.url
      : undefined
    ;(0, _utils.assert)(
      name || url,
      'Either name or url matcher should be specified'
    )
    return (
      this.frames().find((f) => {
        if (name) return f.name() === name
        return (0, _clientHelper.urlMatches)(
          this._browserContext._options.baseURL,
          f.url(),
          url
        )
      }) || null
    )
  }

  frames() {
    return [...this._frames]
  }

  setDefaultNavigationTimeout(timeout) {
    this._timeoutSettings.setDefaultNavigationTimeout(timeout)

    this._channel.setDefaultNavigationTimeoutNoReply({
      timeout
    })
  }

  setDefaultTimeout(timeout) {
    this._timeoutSettings.setDefaultTimeout(timeout)

    this._channel.setDefaultTimeoutNoReply({
      timeout
    })
  }

  _forceVideo() {
    if (!this._video) this._video = new _video.Video(this, this._connection)
    return this._video
  }

  video() {
    // Note: we are creating Video object lazily, because we do not know
    // BrowserContextOptions when constructing the page - it is assigned
    // too late during launchPersistentContext.
    if (!this._browserContext._options.recordVideo) return null
    return this._forceVideo()
  }

  async $(selector, options) {
    return this._mainFrame.$(selector, options)
  }

  async waitForSelector(selector, options) {
    return this._mainFrame.waitForSelector(selector, options)
  }

  async dispatchEvent(selector, type, eventInit, options) {
    return this._mainFrame.dispatchEvent(selector, type, eventInit, options)
  }

  async evaluateHandle(pageFunction, arg) {
    ;(0, _jsHandle.assertMaxArguments)(arguments.length, 2)
    return this._mainFrame.evaluateHandle(pageFunction, arg)
  }

  async $eval(selector, pageFunction, arg) {
    ;(0, _jsHandle.assertMaxArguments)(arguments.length, 3)
    return this._mainFrame.$eval(selector, pageFunction, arg)
  }

  async $$eval(selector, pageFunction, arg) {
    ;(0, _jsHandle.assertMaxArguments)(arguments.length, 3)
    return this._mainFrame.$$eval(selector, pageFunction, arg)
  }

  async $$(selector) {
    return this._mainFrame.$$(selector)
  }

  async addScriptTag(options = {}) {
    return this._mainFrame.addScriptTag(options)
  }

  async addStyleTag(options = {}) {
    return this._mainFrame.addStyleTag(options)
  }

  async exposeFunction(name, callback) {
    return this._wrapApiCall(async (channel) => {
      await channel.exposeBinding({
        name
      })

      const binding = (source, ...args) => callback(...args)

      this._bindings.set(name, binding)
    })
  }

  async exposeBinding(name, callback, options = {}) {
    return this._wrapApiCall(async (channel) => {
      await channel.exposeBinding({
        name,
        needsHandle: options.handle
      })

      this._bindings.set(name, callback)
    })
  }

  async setExtraHTTPHeaders(headers) {
    return this._wrapApiCall(async (channel) => {
      ;(0, _network.validateHeaders)(headers)
      await channel.setExtraHTTPHeaders({
        headers: (0, _utils.headersObjectToArray)(headers)
      })
    })
  }

  url() {
    return this._mainFrame.url()
  }

  async content() {
    return this._mainFrame.content()
  }

  async setContent(html, options) {
    return this._mainFrame.setContent(html, options)
  }

  async goto(url, options) {
    return this._mainFrame.goto(url, options)
  }

  async reload(options = {}) {
    return this._wrapApiCall(async (channel) => {
      const waitUntil = (0, _frame.verifyLoadState)(
        'waitUntil',
        options.waitUntil === undefined ? 'load' : options.waitUntil
      )
      return _network.Response.fromNullable(
        (await channel.reload({ ...options, waitUntil })).response
      )
    })
  }

  async waitForLoadState(state, options) {
    return this._mainFrame.waitForLoadState(state, options)
  }

  async waitForNavigation(options) {
    return this._mainFrame.waitForNavigation(options)
  }

  async waitForURL(url, options) {
    return this._mainFrame.waitForURL(url, options)
  }

  async waitForRequest(urlOrPredicate, options = {}) {
    return this._wrapApiCall(async (channel) => {
      const predicate = (request) => {
        if (
          (0, _utils.isString)(urlOrPredicate) ||
          (0, _utils.isRegExp)(urlOrPredicate)
        )
          return (0, _clientHelper.urlMatches)(
            this._browserContext._options.baseURL,
            request.url(),
            urlOrPredicate
          )
        return urlOrPredicate(request)
      }

      const trimmedUrl = trimUrl(urlOrPredicate)
      const logLine = trimmedUrl
        ? `waiting for request ${trimmedUrl}`
        : undefined
      return this._waitForEvent(
        channel,
        _events.Events.Page.Request,
        {
          predicate,
          timeout: options.timeout
        },
        logLine
      )
    })
  }

  async waitForResponse(urlOrPredicate, options = {}) {
    return this._wrapApiCall(async (channel) => {
      const predicate = (response) => {
        if (
          (0, _utils.isString)(urlOrPredicate) ||
          (0, _utils.isRegExp)(urlOrPredicate)
        )
          return (0, _clientHelper.urlMatches)(
            this._browserContext._options.baseURL,
            response.url(),
            urlOrPredicate
          )
        return urlOrPredicate(response)
      }

      const trimmedUrl = trimUrl(urlOrPredicate)
      const logLine = trimmedUrl
        ? `waiting for response ${trimmedUrl}`
        : undefined
      return this._waitForEvent(
        channel,
        _events.Events.Page.Response,
        {
          predicate,
          timeout: options.timeout
        },
        logLine
      )
    })
  }

  async waitForEvent(event, optionsOrPredicate = {}) {
    return this._wrapApiCall(async (channel) => {
      return this._waitForEvent(
        channel,
        event,
        optionsOrPredicate,
        `waiting for event "${event}"`
      )
    })
  }

  async _waitForEvent(channel, event, optionsOrPredicate, logLine) {
    const timeout = this._timeoutSettings.timeout(
      typeof optionsOrPredicate === 'function' ? {} : optionsOrPredicate
    )

    const predicate =
      typeof optionsOrPredicate === 'function'
        ? optionsOrPredicate
        : optionsOrPredicate.predicate

    const waiter = _waiter.Waiter.createForEvent(channel, event)

    if (logLine) waiter.log(logLine)
    waiter.rejectOnTimeout(
      timeout,
      `Timeout while waiting for event "${event}"`
    )
    if (event !== _events.Events.Page.Crash)
      waiter.rejectOnEvent(
        this,
        _events.Events.Page.Crash,
        new Error('Page crashed')
      )
    if (event !== _events.Events.Page.Close)
      waiter.rejectOnEvent(
        this,
        _events.Events.Page.Close,
        new Error('Page closed')
      )
    const result = await waiter.waitForEvent(this, event, predicate)
    waiter.dispose()
    return result
  }

  async goBack(options = {}) {
    return this._wrapApiCall(async (channel) => {
      const waitUntil = (0, _frame.verifyLoadState)(
        'waitUntil',
        options.waitUntil === undefined ? 'load' : options.waitUntil
      )
      return _network.Response.fromNullable(
        (await channel.goBack({ ...options, waitUntil })).response
      )
    })
  }

  async goForward(options = {}) {
    return this._wrapApiCall(async (channel) => {
      const waitUntil = (0, _frame.verifyLoadState)(
        'waitUntil',
        options.waitUntil === undefined ? 'load' : options.waitUntil
      )
      return _network.Response.fromNullable(
        (await channel.goForward({ ...options, waitUntil })).response
      )
    })
  }

  async emulateMedia(options = {}) {
    return this._wrapApiCall(async (channel) => {
      await channel.emulateMedia({
        media: options.media === null ? 'null' : options.media,
        colorScheme:
          options.colorScheme === null ? 'null' : options.colorScheme,
        reducedMotion:
          options.reducedMotion === null ? 'null' : options.reducedMotion,
        forcedColors:
          options.forcedColors === null ? 'null' : options.forcedColors
      })
    })
  }

  async setViewportSize(viewportSize) {
    return this._wrapApiCall(async (channel) => {
      this._viewportSize = viewportSize
      await channel.setViewportSize({
        viewportSize
      })
    })
  }

  viewportSize() {
    return this._viewportSize
  }

  async evaluate(pageFunction, arg) {
    ;(0, _jsHandle.assertMaxArguments)(arguments.length, 2)
    return this._mainFrame.evaluate(pageFunction, arg)
  }

  async addInitScript(script, arg) {
    return this._wrapApiCall(async (channel) => {
      const source = await (0, _clientHelper.evaluationScript)(script, arg)
      await channel.addInitScript({
        source
      })
    })
  }

  async route(url, handler, options = {}) {
    return this._wrapApiCall(async (channel) => {
      this._routes.unshift(
        new _network.RouteHandler(
          this._browserContext._options.baseURL,
          url,
          handler,
          options.times
        )
      )

      if (this._routes.length === 1)
        await channel.setNetworkInterceptionEnabled({
          enabled: true
        })
    })
  }

  async unroute(url, handler) {
    return this._wrapApiCall(async (channel) => {
      this._routes = this._routes.filter(
        (route) => route.url !== url || (handler && route.handler !== handler)
      )
      if (!this._routes.length) await this._disableInterception(channel)
    })
  }

  async _disableInterception(channel) {
    await channel.setNetworkInterceptionEnabled({
      enabled: false
    })
  }

  async screenshot(options = {}) {
    return this._wrapApiCall(async (channel) => {
      const copy = { ...options }
      if (!copy.type)
        copy.type = (0, _elementHandle.determineScreenshotType)(options)
      const result = await channel.screenshot(copy)

      const buffer = _buffer.Buffer.from(result.binary, 'base64')

      if (options.path) {
        await (0, _utils.mkdirIfNeeded)(options.path)
        await _fs.default.promises.writeFile(options.path, buffer)
      }

      return buffer
    })
  }

  async title() {
    return this._mainFrame.title()
  }

  async bringToFront() {
    return this._wrapApiCall(async (channel) => {
      await channel.bringToFront()
    })
  }

  async close(
    options = {
      runBeforeUnload: undefined
    }
  ) {
    try {
      await this._wrapApiCall(async (channel) => {
        if (this._ownedContext) await this._ownedContext.close()
        else await channel.close(options)
      })
    } catch (e) {
      if ((0, _errors.isSafeCloseError)(e)) return
      throw e
    }
  }

  isClosed() {
    return this._closed
  }

  async click(selector, options) {
    return this._mainFrame.click(selector, options)
  }

  async dragAndDrop(source, target, options) {
    return this._mainFrame.dragAndDrop(source, target, options)
  }

  async dblclick(selector, options) {
    return this._mainFrame.dblclick(selector, options)
  }

  async tap(selector, options) {
    return this._mainFrame.tap(selector, options)
  }

  async fill(selector, value, options) {
    return this._mainFrame.fill(selector, value, options)
  }

  locator(selector) {
    return this.mainFrame().locator(selector)
  }

  async focus(selector, options) {
    return this._mainFrame.focus(selector, options)
  }

  async textContent(selector, options) {
    return this._mainFrame.textContent(selector, options)
  }

  async innerText(selector, options) {
    return this._mainFrame.innerText(selector, options)
  }

  async innerHTML(selector, options) {
    return this._mainFrame.innerHTML(selector, options)
  }

  async getAttribute(selector, name, options) {
    return this._mainFrame.getAttribute(selector, name, options)
  }

  async inputValue(selector, options) {
    return this._mainFrame.inputValue(selector, options)
  }

  async isChecked(selector, options) {
    return this._mainFrame.isChecked(selector, options)
  }

  async isDisabled(selector, options) {
    return this._mainFrame.isDisabled(selector, options)
  }

  async isEditable(selector, options) {
    return this._mainFrame.isEditable(selector, options)
  }

  async isEnabled(selector, options) {
    return this._mainFrame.isEnabled(selector, options)
  }

  async isHidden(selector, options) {
    return this._mainFrame.isHidden(selector, options)
  }

  async isVisible(selector, options) {
    return this._mainFrame.isVisible(selector, options)
  }

  async hover(selector, options) {
    return this._mainFrame.hover(selector, options)
  }

  async selectOption(selector, values, options) {
    return this._mainFrame.selectOption(selector, values, options)
  }

  async setInputFiles(selector, files, options) {
    return this._mainFrame.setInputFiles(selector, files, options)
  }

  async type(selector, text, options) {
    return this._mainFrame.type(selector, text, options)
  }

  async press(selector, key, options) {
    return this._mainFrame.press(selector, key, options)
  }

  async check(selector, options) {
    return this._mainFrame.check(selector, options)
  }

  async uncheck(selector, options) {
    return this._mainFrame.uncheck(selector, options)
  }

  async setChecked(selector, checked, options) {
    return this._mainFrame.setChecked(selector, checked, options)
  }

  async waitForTimeout(timeout) {
    return this._mainFrame.waitForTimeout(timeout)
  }

  async waitForFunction(pageFunction, arg, options) {
    return this._mainFrame.waitForFunction(pageFunction, arg, options)
  }

  workers() {
    return [...this._workers]
  }

  on(event, listener) {
    if (event === _events.Events.Page.FileChooser && !this.listenerCount(event))
      this._channel.setFileChooserInterceptedNoReply({
        intercepted: true
      })
    super.on(event, listener)
    return this
  }

  addListener(event, listener) {
    if (event === _events.Events.Page.FileChooser && !this.listenerCount(event))
      this._channel.setFileChooserInterceptedNoReply({
        intercepted: true
      })
    super.addListener(event, listener)
    return this
  }

  off(event, listener) {
    super.off(event, listener)
    if (event === _events.Events.Page.FileChooser && !this.listenerCount(event))
      this._channel.setFileChooserInterceptedNoReply({
        intercepted: false
      })
    return this
  }

  removeListener(event, listener) {
    super.removeListener(event, listener)
    if (event === _events.Events.Page.FileChooser && !this.listenerCount(event))
      this._channel.setFileChooserInterceptedNoReply({
        intercepted: false
      })
    return this
  }

  async pause() {
    return this.context()._wrapApiCall(async (channel) => {
      await channel.pause()
    })
  }

  async pdf(options = {}) {
    return this._wrapApiCall(async (channel) => {
      const transportOptions = { ...options }
      if (transportOptions.margin)
        transportOptions.margin = { ...transportOptions.margin }
      if (typeof options.width === 'number')
        transportOptions.width = options.width + 'px'
      if (typeof options.height === 'number')
        transportOptions.height = options.height + 'px'

      for (const margin of ['top', 'right', 'bottom', 'left']) {
        const index = margin
        if (options.margin && typeof options.margin[index] === 'number')
          transportOptions.margin[index] = transportOptions.margin[index] + 'px'
      }

      const result = await channel.pdf(transportOptions)

      const buffer = _buffer.Buffer.from(result.pdf, 'base64')

      if (options.path) {
        await _fs.default.promises.mkdir(_path.default.dirname(options.path), {
          recursive: true
        })
        await _fs.default.promises.writeFile(options.path, buffer)
      }

      return buffer
    })
  }
}

exports.Page = Page

class BindingCall extends _channelOwner.ChannelOwner {
  static from(channel) {
    return channel._object
  }

  constructor(parent, type, guid, initializer) {
    super(parent, type, guid, initializer)
  }

  async call(func) {
    try {
      const frame = _frame.Frame.from(this._initializer.frame)

      const source = {
        context: frame._page.context(),
        page: frame._page,
        frame
      }
      let result
      if (this._initializer.handle)
        result = await func(
          source,
          _jsHandle.JSHandle.from(this._initializer.handle)
        )
      else
        result = await func(
          source,
          ...this._initializer.args.map(_jsHandle.parseResult)
        )

      this._channel
        .resolve({
          result: (0, _jsHandle.serializeArgument)(result)
        })
        .catch(() => {})
    } catch (e) {
      this._channel
        .reject({
          error: (0, _serializers.serializeError)(e)
        })
        .catch(() => {})
    }
  }
}

exports.BindingCall = BindingCall

function trimEnd(s) {
  if (s.length > 50) s = s.substring(0, 50) + '\u2026'
  return s
}

function trimUrl(param) {
  if ((0, _utils.isRegExp)(param))
    return `/${trimEnd(param.source)}/${param.flags}`
  if ((0, _utils.isString)(param)) return `"${trimEnd(param)}"`
}
