import * as path from 'path'
import {getOr, isPlainObject, isFunction, isString, isNil} from 'lodash/fp'
import * as json5 from 'json5'

import {Loader} from '../types'
import {fs} from '../tools'
import {noop} from '../tools/util'
import Torbjorn from '.'

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
  },
  write: (data: object) => json5.stringify(data, null, 4)
}

const defaultLoaders: {default: Loader; [index: string]: Loader} = {
  default: {
    load: (file: string) => fs.read({file}),
    parse: (content: any) => content,
    write: (data: string) => data
  },
  '.js': {
    load: (file: string) => require(path.resolve(process.cwd(), file)),
    write: (data: string) => data
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

/**
 * Returns config function hooked to Torbjorn instance
 *
 * @param {Torbjorn} self
 * @returns {Function} config setter / getter
 */
function createConfig(self: Torbjorn): ((name: string, mutation?: string | object | ((val: any) => void)) => Promise<any>) {
  /**
   * Returns config filename with given name
   *
   * @param {string} name
   * @returns {string} config filename
   */
  async function configFileOf(name: string): Promise<string> {
    const configFiles: string[] = path.basename(name).includes('.') ? [name] : getOr([], 'configFiles', self.descriptionOf(name))

    const existFlags = await fs.exists(
      [].concat(configFiles).map(path => ({path}))
    )

    return configFiles[existFlags.findIndex(Boolean)] || name
  }

  /**
   * Returns loader object with given name
   *
   * @param {string} name
   * @returns {Loader}
   */
  async function loaderOf(name: string): Promise<Loader> {
    const configFile = await configFileOf(name)

    const loaders = {...defaultLoaders, ...getOr({}, 'loaders', self.descriptionOf(name))}

    return {
      ...loaders.default,
      ...(loaders[Object.keys(loaders).find(key => new RegExp(loaders[key].test || key).test(configFile))] || {})
    }
  }

  /**
   * Gets parsed config file with given name
   *
   * @param {string} name
   * @returns {Promise<any>}
   */
  async function getConfig(name: string): Promise<any> {
    if (!self.descriptionOf(name) || !self.descriptionOf(name).configFiles) {
      throw new Error('Need `configFiles` field')
    }

    const configFile = await configFileOf(name)
    const loader = await loaderOf(name)

    return loader.parse(await loader.load(configFile))
  }

  /**
   * Edit config file with given name
   *
   * @param {string} name
   * @param {Object | String | Function} mutation
   * @returns {Promise<any>} new config
   */
  async function editConfig(name: string, mutation?: object | string | ((val: any) => void)): Promise<any> {
    const config = await getConfig(name).catch(noop)

    if (isNil(mutation)) {
      return config
    }

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

    await fs.write({file: path.resolve(process.cwd(), await configFileOf(name)), data: (await loaderOf(name)).write(modified)})
    return modified
  }

  return editConfig
}

export {createConfig}
