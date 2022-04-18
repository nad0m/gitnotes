import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import flow from 'rollup-plugin-flow'
import { babel } from '@rollup/plugin-babel'
import svg from 'rollup-plugin-svg'
import image from '@rollup/plugin-image'

const packageJson = require('./package.json')

export default {
  input: 'src/lib/index.js',
  output: [
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss(),
    terser(),
    flow(),
    svg(),
    image()
  ]
}
