import { name } from './package.json'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/index.js',
  output: [
    {
      file: `./dist/${name}.cjs.js`,
      format: 'cjs',
    },
    {
      file: `./dist/${name}.cjs.min.js`,
      format: 'cjs',
      plugins: [terser()]
    },
    {
      file: `./dist/${name}.umd.js`,
      format: 'umd',
      name: 'ReactLuckDraw',
    },
    {
      file: `./dist/${name}.umd.min.js`,
      format: 'umd',
      name: 'ReactLuckDraw',
      plugins: [terser()]
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
