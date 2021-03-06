/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import LexicalComposer from '@lexical/react/LexicalComposer'
import { FC } from 'react'

import { isDevPlayground } from './appSettings'
import { SettingsContext, useSettings } from '../context/SettingsContext'
import { SharedHistoryContext } from '../context/SharedHistoryContext'
import Editor from './Editor'
import logo from '../images/logo.svg'
import PlaygroundNodes from '../nodes/PlaygroundNodes'
import TestRecorderPlugin from '../plugins/TestRecorderPlugin'
import TypingPerfPlugin from '../plugins/TypingPerfPlugin'
import Settings from './Settings'
import PlaygroundEditorTheme from '../themes/PlaygroundEditorTheme'
import './setupEnv'
import './index.css'

const App: FC = () => {
  const { settings } = useSettings()
  const { measureTypingPerf } = settings

  const initialConfig = {
    namespace: 'PlaygroundEditor',
    nodes: [...PlaygroundNodes],
    onError: (error) => {
      throw error
    },
    theme: PlaygroundEditorTheme
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <div className="editor-shell">
          <Editor />
        </div>
        <Settings />
        {isDevPlayground && <TestRecorderPlugin />}
        {measureTypingPerf && <TypingPerfPlugin />}
      </SharedHistoryContext>
    </LexicalComposer>
  )
}

export const Playground: FC = () => {
  return (
    <SettingsContext>
      <App />
    </SettingsContext>
  )
}
