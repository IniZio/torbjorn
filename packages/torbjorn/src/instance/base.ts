import {merge, isFunction} from 'lodash/fp'

import {Description, Config} from '../types'
import Torbjorn from '.'

class BaseTorbjorn {
  private _options: any

  private _descriptions: {[index: string]: Description}

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config: (((self: Torbjorn) => Config[]) | Config[]) = [],
    options: {} = {}
  ) {
    this._options = options
  }

  /**
   * Find description with given name
   *
   * @param {string} name
   * @returns {Description} Feature description
   * @memberof Torbjorn
   */
  descriptionOf = (name: string): Description => {
    return this._descriptions[name]
  }

  /**
   * Edit description of given name
   *
   * @param {string} name
   * @param {Description} meta
   * @memberof Torbjorn
   */
  describe = (name: string, meta: Description | ((old: Description) => Description)): void => {
    this._descriptions = isFunction(meta) ? {[name]: meta(this._descriptions[name])} : merge({[name]: meta}, this._descriptions)
  }

  // /**
  //  * Install dependencies
  //  *
  //  * @param {(string | string[])} deps
  //  * @param {YarnOptions} [options]
  //  * @memberof Torbjorn
  //  */
  // // eslint-disable-next-line @typescript-eslint/member-ordering
  // install: Installer = Object.assign((deps: string | string[], options?: YarnOptions): void => {
  //   const queue = this._installs.find(({options: opt}) => isEqual(opt, options))

  //   if (queue) {
  //     queue.deps.push(...[].concat(deps))
  //   } else {
  //     this._installs.push({deps: [].concat(deps), options})
  //   }
  // }, {
  //   now: install
  // })
}

export default BaseTorbjorn
