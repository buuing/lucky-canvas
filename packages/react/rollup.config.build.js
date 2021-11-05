import pkg from './package.json'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/index.js',
  output: [
    {
      file: `${pkg.module}.js`,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: `${pkg.module}.min.js`,
      format: 'esm',
      plugins: [terser()]
    },
    {
      file: `${pkg.unpkg}.js`,
      format: 'umd',
      name: 'ReactLuckDraw',
      sourcemap: true,
      globals: {
        'lucky-canvas': 'LuckyCanvas',
      },
    },
    {
      file: `${pkg.unpkg}.min.js`,
      format: 'umd',
      name: 'ReactLuckDraw',
      plugins: [terser()],
      globals: {
        'lucky-canvas': 'LuckyCanvas',
      },
    },
  ],
  plugins: [
    babel(),
    resolve(),
    commonjs(),
    json(),
  ],
  external: ['react'],
}
