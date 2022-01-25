import path from 'path'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
// import eslint from '@rollup/plugin-eslint'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.jsdelivr,
      format: 'umd',
      name: 'LuckyCanvas',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    // eslint({
    //   throwOnError: true,
    //   throwOnWarning: true,
    //   include: ['src/**'],
    //   exclude: ['node_modules/**']
    // }),
    ts({
      tsconfig: path.resolve(__dirname, './tsconfig.json'),
      extensions: ['.js', '.ts']
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    livereload(),
    serve({
      open: true,
      port: 13000,
      contentBase: './',
      openPage: '/examples/index.html'
    }),
  ]
}
