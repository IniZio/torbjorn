import * as path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava'

import {fs} from '../../src/tools/fs'

const resolve = (...args: string[]): string => path.resolve(__dirname, './site/', ...args)

test.serial('fs.mkdir', async t => {
  await t.notThrowsAsync(() => fs.mkdir({path: resolve('.')}))
})

test.serial('fs.write', async t => {
  await t.notThrowsAsync(() => fs.write({file: resolve('src.js'), data: 'const abc = <%= value %>'}))
})

test.serial('fs.copy', async t => {
  await t.notThrowsAsync(() => fs.copy({src: resolve('src.js'), dest: resolve('dest.js')}))
})

test.serial('fs.move', async t => {
  await t.notThrowsAsync(async () => {
    await fs.move({src: resolve('src.js'), dest: resolve('move.js')})
    await fs.move({src: resolve('move.js'), dest: resolve('src.js')})
  })
})

test.serial('fs.ejs', async t => {
  await t.notThrowsAsync(async () => {
    await fs.ejs({src: resolve('src.js'), dest: resolve('tpl.js'), context: {value: 100}})

    t.is(await fs.read({file: resolve('tpl.js')}), 'const abc = 100')
  })
})

test.serial('fs.exists', async t => {
  const [tpl, rand] = await fs.exists([{path: resolve('src.js')}, {path: resolve('random.js')}])

  t.is(tpl, true)
  t.is(rand, false)
})

test.serial('fs.emptydir', async t => {
  await t.notThrowsAsync(async () => {
    await fs.emptydir({path: resolve('.')})
  })
})

test.serial('fs.remove', async t => {
  await t.notThrowsAsync(() => fs.remove({path: resolve('.')}))
})
