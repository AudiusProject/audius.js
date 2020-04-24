import rollupTypescript from 'rollup-plugin-typescript2'
import typescript from 'typescript'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import url from 'rollup-plugin-url'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    // {
    //   file: pkg.module,
    //   format: 'es',
    //   exports: 'named',
    //   sourcemap: true
    // }
  ],
  external: ['@audius/libs'],
  plugins: [
    external(),
    url(),
    json(),
    rollupTypescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      typescript
    }),
    resolve(),
    commonjs(),
  ]
}