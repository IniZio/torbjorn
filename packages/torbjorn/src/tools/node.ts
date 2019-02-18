import * as execa from 'execa'
import * as yarnInstall_ from 'yarn-install'

import {YarnOptions} from '../types'

export const exec = execa

// For fixing cannot call namespace issue
// @ts-ignore
const yarnInstall = yarnInstall_.default || yarnInstall

export const install = (
  (deps: string | string[], options?: YarnOptions): Promise<void> =>
    yarnInstall({deps: [].concat(deps), ...options})
)
