import { name } from './package.json'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js',
  output: [
    {
      file: `./dist/${name}.cjs.js`,
      format: 'cjs',
    },
  ],
  plugins: [
    babel(),
    resolve(),
    commonjs(),
    json(),
    livereload(),
    serve({
      open: true,
      contentBase: './'
    }),
  ],
  external: ['react'],
}
