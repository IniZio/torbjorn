// eslint-disable-next-line import/no-unresolved
import CAC from 'cac/types/CAC'

import Torbjorn from '../instance'

export function initRun(terminal: CAC, torbjorn: Torbjorn): void {
  terminal
    .command('run', 'Runs given config')
    .action(async () => {
      await torbjorn.run()
    })
}
