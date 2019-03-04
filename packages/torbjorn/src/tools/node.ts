// import * as spawn_ from 'cross-spawn-with-kill'
import * as execa from 'execa'
import * as yarnInstall_ from 'yarn-install'

import {YarnOptions} from '../types'

export const exec = (file: string, args?: ReadonlyArray<string>, options: execa.Options = {}): execa.ExecaChildProcess => execa.call(null, file, args, {stdio: 'inherit', ...options})
// export const spawn = spawn_

// For fixing cannot call namespace issue
// @ts-ignore
const yarnInstall = yarnInstall_.default || yarnInstall

export const install = (
  (deps: string | string[], options?: YarnOptions): Promise<void> =>
    yarnInstall({deps: [].concat(deps), ...options})
)
