import {fs, git} from './tools'
import {noop} from './tools/util'

export async function applyAction(action: string = 'something'): Promise<void> {
  const branch = `torbjorn-${new Date().getTime()}`
  const configFile = './.torbrc.js'

  const originalBranch = await git().raw(['rev-parse', '--abbrev-ref', 'HEAD']).then(t => t.trim())

  // Save the config first
  await git().add(configFile)
  await git().commit('chore(torbjorn): saving torbjorn config', configFile)

  await git().checkoutBranch(branch, originalBranch)

  // Stash everything.
  // TODO: should be before the whole series of action rather than per action
  await git().add('.')
  await git().stash()

  // mocks an action
  await fs.write({file: './action-stuff', data: 'bili bala'})

  // Stage everything to generate patch
  await git().add('.')
  await fs.write({file: `./.torb/${action}.patch`, data: await git().diff(['--patch', '--staged'])})
  await git().commit(action, '.')

  // Reset soft to pass actions to original branch
  await git().reset(['--soft', originalBranch])
  await git().checkout(originalBranch)

  // May not have stashed to pop
  await git().stash(['pop']).catch(noop)
}

export async function revertAction(action: string = 'something'): Promise<void> {
  await git().raw(['apply', '-R', `./.torb/${action}.patch`])
}
