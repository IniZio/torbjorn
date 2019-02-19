import BaseTorbjorn from './base'

import {addTools} from './tool'
import {addInclude} from './include'
import {addConfig} from './config'
import {addAction} from './action'

class Torbjorn extends addAction(addConfig(addInclude(addTools(BaseTorbjorn)))) {}

export default Torbjorn
