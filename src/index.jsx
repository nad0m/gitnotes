/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import React from 'react'
// $FlowFixMe: Flow doesn't understand react-dom
import { createRoot } from 'react-dom/client'

import App from './App'
import { initFirebase } from './firebase'

initFirebase()

// Handle runtime errors
const showErrorOverlay = (err) => {
  const ErrorOverlay = customElements.get('vite-error-overlay')
  if (!ErrorOverlay) {
    return
  }
  const overlay = new ErrorOverlay(err)
  const body = document.body
  if (body !== null) {
    body.appendChild(overlay)
  }
}

window.addEventListener('error', showErrorOverlay)
window.addEventListener('unhandledrejection', ({ reason }) =>
  showErrorOverlay(reason)
)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
