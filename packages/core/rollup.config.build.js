import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
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
        name: 'LuckyCanvas',
        sourcemap: false,
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
      babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**',
      }),
      terser()
    ]
  }, {
    input: "dist/src/index.d.ts",
    output: [
      {
        file: "types/index.d.ts",
        format: "es"
      }
    ],
    plugins: [
      dts(),
      del({
        targets: ['dist/src'],
        hook: 'buildEnd'
      })
    ],
  },
]
