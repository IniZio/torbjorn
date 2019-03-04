import * as path from 'path'
import {getOr, isPlainObject, isFunction, isString, isNil} from 'lodash/fp'
import * as json5 from 'json5';

import {Loader, Config} from '../types'
import {fs} from '../tools'
import {noop} from '../tools/util'
import BaseTorbjorn from './base'

const codeStringify = require('inizio1-javascript-stringify')

const jsonLoader: Loader = {
  parse: (content: string) => {
    try {
      return json5.parse(content)
    } catch (error) {
      const err = new SyntaxError(error.message)
      // @ts-ignore
      err.line = error.lineNumber
      // @ts-ignore
      err.column = error.columnNumber

      throw err
    }
  }
}

const defaultLoaders: {default: Loader; [index: string]: Loader} = {
  default: {
    load: (file: string) => fs.read({file}),
    parse: (content: any) => content,
    write: (data: any) => data
  },
  '.js': {
    test: /\.js$/,
    load: (file: string) => require(path.resolve(process.cwd(), file)),
    write: (data: any) => 'module.exports = ' + codeStringify(data, null, 2)
  },
  '.json': jsonLoader,
  rc: jsonLoader,
  '': {
    test: /^[^.]+$/,
    load: (key: string) => fs.read({file: 'package.json'}).then((content: string) => {
      try {
        return json5.parse(content)[key]
      } catch (error) {
        const err = new SyntaxError(error.message)
        // @ts-ignore
        err.line = error.lineNumber
        // @ts-ignore
        err.column = error.columnNumber

        throw err
      }
    })
  }
}

export interface ConfigTorbjorn extends BaseTorbjorn {
  readonly configs: any[];

  load(name: string): Promise<any>;
  config(name: string, mutation?: object | string | ((val: any) => void)): Promise<any>;
}

/**
 * Returns config function hooked to Torbjorn instance
 *
 * @param {Torbjorn} self
 * @returns {Function} config setter / getter
 */
type Constructor<T = {}> = new (...args: any[]) => T;

function addConfig<TBase extends Constructor<BaseTorbjorn>>(BaseClass: TBase): TBase & Constructor<ConfigTorbjorn> {
  return class extends BaseClass implements BaseTorbjorn, ConfigTorbjorn {
    private _configs = []

    get configs(): any[] {
      return this._configs
    }

    constructor(...args: any[]) {
      super(...args)

      const config: (((self: BaseTorbjorn) => Config[]) | Config[]) = args[0]

      if (config) {
        this._configs = isFunction(config) ? config(this) : config
      }

      this.describe('torbjorn', {
        configFiles: ['.torbrc.js']
      })

      this.describe('torbjorn-task', {
        configFiles: ['.torbtask.js']
      })
    }

    /**
     * Load config file like require
     *
     * @async
     * @param {string} name
     * @returns {Promise<any>} raw config
     */
    load = async (name: string): Promise<any> => {
      const configFile = await this._configFileOf(name)

      if (!configFile) {
        throw new Error('Need `configFiles` field')
      }

      const loader = await this._loaderOf(name)

      return loader.load(configFile)
    }

    /**
     * Edit config file with given name
     *
    * @async
     * @param {string} name
     * @param {Object | String | Function} mutation
     * @returns {Promise<any>} new config
     */
    config = async (name: string, mutation?: object | string | ((val: any) => void)): Promise<any> => {
      const getConfig = async (name: string): Promise<any> => {
        const loader = await this._loaderOf(name)

        return loader.parse(await this.load(name))
      }

      if (isNil(mutation)) {
        return getConfig(name)
      }

      const config = await getConfig(name).catch(noop)

      let modified: any

      switch (true) {
        case isPlainObject(mutation):
          modified = isPlainObject(config) ? Object.assign(config, mutation) : mutation
          break
        case isFunction(mutation):
        // @ts-ignore
          modified = mutation(config)
          break
        case isString(mutation):
        default:
          modified = mutation
      }

      await fs.write({
        file: path.resolve(process.cwd(), await this._configFileOf(name)),
        data: (await this._loaderOf(name)).write(modified)
      })
      return modified
    }

    private _configFileOf = async (name: string): Promise<string> => {
      const configFiles: string[] = path.basename(name).includes('.') ? [name] : getOr([], 'configFiles', this.descriptionOf(name))

      const existFlags = await fs.exists(
        [].concat(configFiles).map(path => ({path}))
      )

      return configFiles[existFlags.findIndex(Boolean)] || configFiles[0]
    }

    private _loaderOf = async (name: string): Promise<Loader> => {
      const configFile = await this._configFileOf(name)

      const loaders = {...defaultLoaders, ...getOr({}, 'loaders', this.descriptionOf(name))}

      return {
        ...loaders.default,
        ...(loaders[Object.keys(loaders).find(key => new RegExp(loaders[key].test || key).test(configFile))] || {})
      }
    }
  }
}

export {addConfig}
