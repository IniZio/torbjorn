import {flow} from 'lodash/fp'

import BaseTorbjorn from './base'

import {addTools} from './tool'
import {addInclude} from './include'
import {addConfig} from './config'
import {addTask} from './task'

class Torbjorn extends flow(addConfig, addInclude, addTools, addTask)(BaseTorbjorn) {}

export default Torbjorn
