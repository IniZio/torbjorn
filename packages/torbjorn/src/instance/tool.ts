import {SimpleGit} from 'simple-git/promise'
import * as prompts from 'prompts'

import {Constructor} from '../types'
import {fs, git, prompt, exec} from '../tools'
import BaseTorbjorn from './base'

export interface ToolsTorbjorn {
  readonly answers: any;

  git: SimpleGit;
  exec: typeof exec;
  fs: typeof fs;
  prompt<T extends string = string>(questions: any, options?: any): Promise<prompts.Answers<T>>;
}

function addTools<TBase extends Constructor<BaseTorbjorn>>(BaseClass: TBase): TBase & Constructor<ToolsTorbjorn> {
  return class extends BaseClass implements BaseTorbjorn {
    git = git().silent(false)

    exec = exec

    fs = fs

    private _answers = {}

    get answers(): any {
      return this._answers
    }

    prompt = async <T extends string = string>(
      questions: prompts.PromptObject<T> | prompts.PromptObject<T>[],
      options?: prompts.Options
    ): Promise<prompts.Answers<T>> => {
      const answers = await prompt(questions, options)

      Object.assign(this._answers, answers)
      return answers
    }
  }
}

export {addTools}
