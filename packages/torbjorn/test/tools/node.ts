// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava'

import {exec, install} from '../../src/tools/node'

test('exec', async t => {
  const HELLO: any = 'hello'

  t.is(await exec.stdout('echo', [HELLO]), HELLO)
})

test('install', t => {
  t.notThrows(() => install(['yarn-install'], {global: true}))
})
