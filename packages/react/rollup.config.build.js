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
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: pkg.jsdelivr,
      format: 'umd',
      name: 'ReactLuckDraw',
      sourcemap: true,
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
    terser(),
  ],
  external: ['react'],
}
