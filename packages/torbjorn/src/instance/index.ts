import {flow} from 'lodash/fp'

import BaseTorbjorn from './base'

import {addTools} from './tool'
import {addInclude} from './include'
import {addConfig} from './config'

class Torbjorn extends flow(addConfig, addInclude, addTools)(BaseTorbjorn) {}

export default Torbjorn
