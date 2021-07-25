import { name } from './package.json'
import ts from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/${name}.cjs.js`,
      format: 'cjs',
    },
    {
      file: `dist/${name}.cjs.min.js`,
      format: 'cjs',
      plugins: [terser()]
    },
    {
      file: `dist/${name}.umd.js`,
      format: 'umd',
      name: 'LuckyCanvas',
    },
    {
      file: `dist/${name}.umd.min.js`,
      format: 'umd',
      name: 'LuckyCanvas',
      plugins: [terser()]
    },
    {
      file: `umd.min.js`,
      format: 'umd',
      name: 'LuckyCanvas',
      plugins: [terser()]
    },
  ],
  plugins: [
    ts(),
    json(),
    resolve(),
    commonjs(),
    babel({ exclude: 'node_modules/**' }),
  ]
}
