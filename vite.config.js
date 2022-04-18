/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { flowPlugin, esbuildFlowPlugin } from '@bunchtogether/vite-plugin-flow';
import path from 'path';
import fs from 'fs';
import { replaceCodePlugin } from 'vite-plugin-replace';
import babel from '@rollup/plugin-babel';

const moduleResolution = [
  { find: /lexical$/, replacement: path.resolve('./packages/lexical/src/index.js') },
  {
    find: '@lexical/clipboard',
    replacement: path.resolve('./packages/lexical-clipboard/src/index.js'),
  },
  {
    find: '@lexical/selection',
    replacement: path.resolve('./packages/lexical-selection/src/index.js'),
  },
  {
    find: '@lexical/text',
    replacement: path.resolve('./packages/lexical-text/src/index.js'),
  },
  {
    find: '@lexical/hashtag',
    replacement: path.resolve('./packages/lexical-hashtag/src/index.js'),
  },
  {
    find: '@lexical/history',
    replacement: path.resolve('./packages/lexical-history/src/index.js'),
  },
  {
    find: '@lexical/list',
    replacement: path.resolve('./packages/lexical-list/src/index.js'),
  },
  {
    find: '@lexical/file',
    replacement: path.resolve('./packages/lexical-file/src/index.js'),
  },
  {
    find: '@lexical/table',
    replacement: path.resolve('./packages/lexical-table/src/index.js'),
  },
  {
    find: '@lexical/offset',
    replacement: path.resolve('./packages/lexical-offset/src/index.js'),
  },
  {
    find: '@lexical/utils',
    replacement: path.resolve('./packages/lexical-utils/src/index.js'),
  },
  {
    find: '@lexical/code',
    replacement: path.resolve('./packages/lexical-code/src/index.js'),
  },
  {
    find: '@lexical/plain-text',
    replacement: path.resolve('./packages/lexical-plain-text/src/index.js'),
  },
  {
    find: '@lexical/rich-text',
    replacement: path.resolve('./packages/lexical-rich-text/src/index.js'),
  },
  {
    find: '@lexical/dragon',
    replacement: path.resolve('./packages/lexical-dragon/src/index.js'),
  },
  {
    find: '@lexical/link',
    replacement: path.resolve('./packages/lexical-link/src/index.js'),
  },
  {
    find: '@lexical/overflow',
    replacement: path.resolve('./packages/lexical-overflow/src/index.js'),
  },
  {
    find: '@lexical/markdown',
    replacement: path.resolve('./packages/lexical-markdown/src/index.js'),
  },
  {
    find: '@lexical/yjs',
    replacement: path.resolve('./packages/lexical-yjs/src/index.js'),
  },
  {
    find: '@lexical/playground',
    replacement: path.resolve('./index.js'),
  },
  { find: 'shared', replacement: path.resolve('./shared') },
  { find: 'configs', replacement: path.resolve('./src/configs') },
];

// Lexical React
[
  'LexicalTreeView',
  'LexicalComposer',
  'LexicalComposerContext',
  'useLexicalIsTextContentEmpty',
  'useLexicalTextEntity',
  'LexicalContentEditable',
  'LexicalNestedComposer',
  'LexicalHorizontalRuleNode',
  'useLexicalNodeSelection',
  'LexicalMarkdownShortcutPlugin',
  'LexicalCharacterLimitPlugin',
  'LexicalHashtagPlugin',
  'LexicalPlainTextPlugin',
  'LexicalRichTextPlugin',
  'LexicalClearEditorPlugin',
  'LexicalCollaborationPlugin',
  'LexicalHistoryPlugin',
  'LexicalTablePlugin',
  'LexicalLinkPlugin',
  'LexicalListPlugin',
  'LexicalAutoFocusPlugin',
  'LexicalAutoLinkPlugin',
  'LexicalOnChangePlugin',
  'LexicalAutoScrollPlugin',
].forEach((module) => {
  let resolvedPath = path.resolve(`./packages/lexical-react/src/${module}.js`);
  if (fs.existsSync(resolvedPath)) {
    moduleResolution.push({
      find: `@lexical/react/${module}`,
      replacement: resolvedPath,
    });
  } else {
    resolvedPath = path.resolve(`./packages/lexical-react/src/${module}.jsx`);
    moduleResolution.push({
      find: `@lexical/react/${module}`,
      replacement: resolvedPath,
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gitnotes/',
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildFlowPlugin()],
    },
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    replaceCodePlugin({
      replacements: [
        {
          from: /__DEV__/g,
          to: 'true',
        },
      ],
    }),
    babel({
      babelHelpers: 'bundled',
      babelrc: false,
      configFile: false,
      exclude: '/**/node_modules/**',
      plugins: [
        '@babel/plugin-transform-flow-strip-types',
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-optional-chaining',
        [
          require('./scripts/error-codes/transform-error-messages'),
          { noMinify: true },
        ],
        '@babel/plugin-proposal-nullish-coalescing-operator',

      ],
      presets: ['@babel/preset-react', '@babel/preset-env'],
    }),
    flowPlugin(),
    react(),
  ],
  resolve: {
    alias: moduleResolution,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        split: new URL('./split/index.html', import.meta.url).pathname,
      },
    },
  },
});
