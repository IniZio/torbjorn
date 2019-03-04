import {Constructor} from '../types'
import {ConfigTorbjorn} from './config';

export interface TaskTorbjorn {
  task(script: object): Promise<void>;
}

function addTask<TBase extends Constructor<ConfigTorbjorn>>(BaseClass: TBase): TBase & Constructor<TaskTorbjorn> & Constructor<ConfigTorbjorn> {
  return class extends BaseClass {
    async task(script: object): Promise<void> {
      await this.config('torbjorn.task', script)
    }
  }
}

export {addTask}
