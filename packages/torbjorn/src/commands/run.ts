// eslint-disable-next-line import/no-unresolved
import CAC from 'cac/types/CAC'

import Torbjorn from '../instance'

const opt2Arr = val => val ? [].concat(val).reduce((acc, o) => [...acc, ...(typeof o === 'string' ? o.split(',') : o)], []) : val

export function initRun(terminal: CAC, torbjorn: Torbjorn): void {
  terminal
    .command('run', 'Runs given config')
    .option('--only <only>', 'Only include certain actions')
    .option('--except <except>', 'Exclude certain actions')
    .action(async () => {
      await torbjorn.run()
    })
}
