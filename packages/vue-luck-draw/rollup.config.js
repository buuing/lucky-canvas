
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import PostCSS from 'rollup-plugin-postcss'
import pkg from './package.json'

const external = ['vue-demi']

const plugins = [
  typescript(),
  PostCSS(),
  commonjs(),
]

export default [
  {
    plugins,
    external,
    input: 'src/index.ts',
    output: [
      {
        format: 'esm',
        file: pkg.module,
        sourcemap: true,
      },
      {
        exports: 'named',
        format: 'cjs',
        file: pkg.main
      },
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'VueLuckDraw',
        sourcemap: true,
        globals: {
          'vue-demi': 'VueDemi',
        },
      }
    ]
  }
]
