import * as cac_ from 'cac'
import * as updateNotifier_ from 'update-notifier'

import Torbjorn from './instance'

import {initRun} from './commands/run'

const cac = cac_
const updateNotifier = updateNotifier_

const terminal = cac('Torbjorn')

export async function cli(): Promise<void> {
  try {
    updateNotifier({pkg: require('../package.json'), shouldNotifyInNpmScript: true}).notify()
  } catch (_) {}

  const torbjorn = new Torbjorn(await (new Torbjorn().load('torbjorn')))

  // terminal
  //   .option('--require <turret>', 'Require external turrets')

  initRun(terminal, torbjorn)

  terminal.version(require('../package.json').version)

  terminal.parse()
}
