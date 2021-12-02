import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import PostCSS from 'rollup-plugin-postcss'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.jsdelivr,
        format: 'umd',
        name: 'VueLuckyCanvas',
        sourcemap: true,
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
    ],
    external: ['vue-demi'],
  }
]
