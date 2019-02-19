import {get, isFunction} from 'lodash/fp'
import * as ejs from 'ejs'

import {Constructor, Action, Config} from '../types'
import {serial} from '../tools/util'
import BaseTorbjorn from './base'
import {ConfigTorbjorn} from './config'
import {ToolsTorbjorn} from './tool'

export interface ActionsTorbjorn extends BaseTorbjorn {
  action(action: Action): [string, Action];
  run(): Promise<any>;
}

function addAction<TBase extends Constructor<BaseTorbjorn> & Constructor<ConfigTorbjorn> & Constructor<ToolsTorbjorn>>(BaseClass: TBase): TBase & Constructor<ActionsTorbjorn> {
  return class extends BaseClass implements ConfigTorbjorn, ToolsTorbjorn {
    private _actions = []

    constructor(...args: any[]) {
      super(...args)

      let method: any

      this.configs.forEach(([type, ...params], index) => {
        switch (type) {
          case 'action':
            this._actions.push(this.action(params[0] as Action)[1])
            break
          // case 'include':
          //   this._includes.push(this.include(params[1], params[2])[1], this.include(params[1], params[2])[2])
          //   break
          default:
            method = get(type, this) || get(type, global)
            if (method) {
              this._actions.push({
                name: `${type}-${index}`,
                call: () => method(...params)
              })
            }
        }
      })
    }

    /**
   * Transforms action to ast
   *
   * @param {Action} action
   * @returns {[string, Action]} config item
   * @memberof Torbjorn
   */
    action = (action: Action): [string, Action] => {
      if (Array.isArray(action.call)) {
        const calls = action.call

        action.call = () => serial(
          calls.map(act => () => {
            const [type, ...params] = JSON.parse(ejs.render(JSON.stringify(act), this.answers)) as Config

            const methodOf = get(type) as (...args: any[]) => (...args: any[]) => any

            const method = methodOf(this) || methodOf(global)

            if (!isFunction(method)) {
              throw new Error(`method ${type} is not a valid function`)
            }

            return method(...params)
          })
        )
      }

      return [
        'action',
        action
      ]
    }

    /**
     * Run all existing actions
     *
     * @memberof Torbjorn
     */
    run = async (): Promise<void> => {
      // TODO: setup new branch
      await this._dispatch(this._actions.map(action => action.name))
      // TODO: go back to original branch
    }

    /**
     * Executes actions with given names
     *
     * @param {(string | string[])} [names]
     * @memberof Torbjorn
     */
    private _dispatch = async (names?: string | string[]): Promise<void> => {
      if (!names) {
        return
      }

      await serial(
        [].concat(names)
          .map(name => this._actions.find(action => action.name === name))
          .filter(Boolean)
          // TODO: make git patch thing from patch.js
          .map(func => () => isFunction(func.call) && func.call(this))
      )
    }
  }
}

export {addAction}
