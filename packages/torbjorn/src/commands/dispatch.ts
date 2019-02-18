// eslint-disable-next-line import/no-unresolved
import CAC from 'cac/types/CAC'

import Torbjorn from '../instance'

export function initDispatch(terminal: CAC, torbjorn: Torbjorn): void {
  terminal
    .command('dispatch [...actions]', 'Dispatches actions in current folder')
    .action(async (actions: string[]) => {
      await torbjorn.dispatch(actions)
    })
}
