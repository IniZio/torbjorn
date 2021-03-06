import path from 'path'
import toPascal from 'to-pascal-case'
import typescript from 'rollup-plugin-typescript2'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'
import copy from 'rollup-plugin-copy-glob'
import {uglify} from 'rollup-plugin-uglify'
import {minify} from 'uglify-es'
import getLernaPackages from 'get-lerna-packages'

const builds = {
  'torbjorn': {}
}

const isProduction = process.env.NODE_ENV === 'production'

const ALL_MODULES = getLernaPackages(process.cwd()).map(
  name => name.replace(/(.*)packages\//, '')
)

const mirror = array =>
  array.reduce((acc, val) => ({...acc, [val]: val}), {})

const isBrowserBundle = format => ['umd', 'iife'].includes(format)

export default Object.keys(builds).reduce((tasks, name) => {
  const build = builds[name]

  const PACKAGE_ROOT_PATH = path.join(process.cwd(), 'packages', name)
  const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, 'src/index.ts')
  const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, 'dist')
  // const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'))

  return [
    ...tasks,
    ...['es', 'cjs'].map(format => ({
      plugins: [
        json(),
        isBrowserBundle(format) && (
          nodeResolve({
            main: false,
            module: true,
            jsnext: true,
            preferBuiltIns: true,
            browser: isBrowserBundle(format)
          })
        ),
        // replace({
        //   delimiters: ['', ''],
        //   values: {
        //     'require(\'readable-stream/transform\')': 'require(\'stream\').Transform',
        //     'require("readable-stream/transform")': 'require("stream").Transform',
        //     'readable-stream': 'stream'
        //   }
        // }),
        typescript({
          rollupCommonJSResolveHack: true,
          tsconfig: `packages/${name}/tsconfig.json`,
          typescript: require('typescript')
        }),
        commonjs({
          ignoreGlobal: true,
          namedExports: {
            'node_modules/lodash/fp.js': ['flow', 'merge', 'isFunction', 'getOr', 'isPlainObject', 'isString', 'isNil']
          }
        }),
        // isProduction && (
        //   uglify({}, minify)
        // ),
        copy([
          {files: `packages/${name}/src/${name}.{d.ts,js.flow}`, dest: `packages/${name}/dist`}
        ], {
          verbose: true
        })
      ].filter(Boolean),
      input: INPUT_FILE,
      external: isBrowserBundle(format) ? build.external : [...ALL_MODULES, ...(build.external || [])],
      output: {
        name: toPascal(name),
        file: path.join(OUTPUT_DIR, `${name}.${format}.js`),
        format,
        globals: isBrowserBundle(format) ? {...mirror(ALL_MODULES), ...build.globals} : build.globals,
        sourcemap: true
      }
    }))
  ]
}, [])
