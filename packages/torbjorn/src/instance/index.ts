import {get, merge, isFunction, isEqual} from 'lodash/fp'
import autobind from 'autobind-decorator'
import * as prompts from 'prompts'
import * as ejs from 'ejs'

import {FsOperations, Description, Installer, Action, Config} from '../types'
import {fs, git, install, prompt} from '../tools'
import {serial} from '../tools/util'
import {createConfig} from './config'

@autobind
class Torbjorn {
  fs: FsOperations = fs

  /**
   * Config editor
   *
   * @param {string} name
   * @param {any} [mutation]
   * @returns {any} current config
   * @memberof Torbjorn
   */
  config = createConfig(this)

  private _installs: {deps: string[]; options: YarnOptions}[] = []

  private _actions: Action[] = []

  private _answers: any = {}

  private _options: any

  private _descriptions: {[index: string]: Description}

  constructor(
    config: (((self: Torbjorn) => Config[]) | Config[]) = [],
    options: {} = {}
  ) {
    this._options = options

    const _config = isFunction(config) ? config(this) : config

    let method: any

    _config.forEach(([type, ...params], index) => {
      switch (type) {
        case 'action':
          this._actions.push(this._action(params[0] as Action)[1])
          break
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

    this.describe('torbjorn', {
      configFiles: ['.torbrc.js', '.torbrc.json', '.torbrc']
    })
  }

  /**
   * Find description with given name
   *
   * @param {string} name
   * @returns {Description} Feature description
   * @memberof Torbjorn
   */
  descriptionOf(name: string): Description {
    return this._descriptions[name]
  }

  /**
   * Edit description of given name
   *
   * @param {string} name
   * @param {Description} meta
   * @memberof Torbjorn
   */
  describe(name: string, meta: Description | ((old: Description) => Description)): void {
    this._descriptions = isFunction(meta) ? {[name]: meta(this._descriptions[name])} : merge({[name]: meta}, this._descriptions)
  }

  /**
   * Adds action to queue
   *
   * @private
   * @param {Action} action
   * @returns {[string, Action]} config item
   * @memberof Torbjorn
   */
  private _action(action: Action): [string, Action] {
    if (Array.isArray(action.call)) {
      const calls = action.call

      action.call = () => serial(
        calls.map(act => () => {
          const [type, params] = JSON.parse(ejs.render(JSON.stringify(act), this._answers)) as Config

          const methodOf = get(type)

          const method = methodOf(this) || methodOf(global)

          return method(params)
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
  async run(): Promise<void> {
    // TODO: setup new branch
    await this.dispatch(this._actions.map(action => action.name))
    // TODO: go back to original branch
  }

  /**
   * Prompts user for input
   *
   * @template T
   * @param {(prompts.PromptObject<T> | prompts.PromptObject<T>[])} questions
   * @param {prompts.Options} [options]
   * @returns {Promise<prompts.Answers<T>>} User input
   * @memberof Torbjorn
   */
  async prompts<T extends string = string>(
    questions: prompts.PromptObject<T> | prompts.PromptObject<T>[],
    options?: prompts.Options
  ): Promise<prompts.Answers<T>> {
    const answers = await prompt(questions, options)

    Object.assign(this._answers, answers)
    return answers
  }

  /**
   * Git tools
   *
   * @param {string} [basePath]
   * @returns {SimpleGit} git instance
   * @memberof Torbjorn
   */
  git = git().silent(false)

  /**
   * Install dependencies
   *
   * @param {(string | string[])} deps
   * @param {YarnOptions} [options]
   * @memberof Torbjorn
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  install: Installer = Object.assign((deps: string | string[], options?: YarnOptions): void => {
    const queue = this._installs.find(({options: opt}) => isEqual(opt, options))

    if (queue) {
      queue.deps.push(...[].concat(deps))
    } else {
      this._installs.push({deps: [].concat(deps), options})
    }
  }, {
    now: install
  })

  /**
   * Executes actions with given names
   *
   * @param {(string | string[])} [names]
   * @memberof Torbjorn
   */
  async dispatch(names?: string | string[]): Promise<void> {
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

    if (this._installs) {
      await serial(
        this._installs.map(({deps, options}) => () => install(deps, options))
      )

      this._installs = []
    }
  }
}

export default Torbjorn
