import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
import { name } from './package.json'

export default [
  {
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
    ],
    plugins: [
      ts({
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        extensions: ['.js', '.ts'],
        "declaration": true,
      }),
      json(),
      resolve(),
      commonjs(),
      babel({ exclude: 'node_modules/**' }),
    ]
  }, {
    input: "./dist/src/index.d.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "es"
      }
    ],
    plugins: [
      dts(),
      del({
        targets: 'dist/src',
        hook: 'buildEnd'
      })
    ],
  },
]
