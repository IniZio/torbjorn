import {Config} from './types'
import Torbjorn from './instance'

export const declare = (cb: (Config[] | ((t: Torbjorn) => Config[]))): (Config[] | ((t: Torbjorn) => Config[])) => cb

// export {default as Torbjorn} from './instance'
export {cli} from './cli'
