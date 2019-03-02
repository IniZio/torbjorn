import {IncludeOptions, Constructor} from '../types'
import BaseTorbjorn from './base'

export interface IncludeTorbjorn {
  include(turret: string, options: IncludeOptions): void;
}

function addInclude<TBase extends Constructor<BaseTorbjorn>>(BaseClass: TBase): TBase & Constructor<IncludeTorbjorn> {
  return class extends BaseClass {
    include = (identifier: string): void => {
      switch (true) {
        case identifier.includes('./'): // ./sdfsf
        case identifier.startsWith('/'): // /absolute-path
          // file path
          break
        case !identifier.startsWith('@') && identifier.includes('/'): // github repo
          // github
          break
        case identifier.startsWith('@') && identifier.includes('/'):
        default:
          // npm
      }
    }
  }
}

export {addInclude}
