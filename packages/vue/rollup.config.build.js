import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import PostCSS from 'rollup-plugin-postcss'
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'
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
        name: 'VueLuckyCanvas',
        sourcemap: false,
        globals: {
          'vue-demi': 'VueDemi',
          'lucky-canvas': 'LuckyCanvas',
        },
      },
    ],
    plugins: [
      ts(),
      json(),
      resolve(),
      commonjs(),
      PostCSS(),
      terser(),
    ],
    external: ['vue-demi'],
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
        targets: 'dist/src',
        hook: 'buildEnd'
      })
    ],
  },
]
