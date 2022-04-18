'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.StreamDispatcher = void 0

var _dispatcher = require('./dispatcher')

var _utils = require('../utils/utils')

/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class StreamDispatcher extends _dispatcher.Dispatcher {
  constructor(scope, stream) {
    super(
      scope,
      {
        guid: 'stream@' + (0, _utils.createGuid)(),
        stream
      },
      'Stream',
      {}
    ) // In Node v12.9.0+ we can use readableEnded.

    this._ended = false
    stream.once('end', () => (this._ended = true))
    stream.once('error', () => (this._ended = true))
  }

  async read(params) {
    const stream = this._object.stream
    if (this._ended)
      return {
        binary: ''
      }

    if (!stream.readableLength) {
      await new Promise((fulfill, reject) => {
        stream.once('readable', fulfill)
        stream.once('end', fulfill)
        stream.once('error', reject)
      })
    }

    const buffer = stream.read(
      Math.min(stream.readableLength, params.size || stream.readableLength)
    )
    return {
      binary: buffer ? buffer.toString('base64') : ''
    }
  }

  async close() {
    this._object.stream.destroy()
  }
}

exports.StreamDispatcher = StreamDispatcher
