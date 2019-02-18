// // eslint-disable-next-line import/no-extraneous-dependencies
// import test from 'ava'

// import {fs} from '../../src/tools/fs'
// import {config, describe, descriptionOf} from '../../src/tools/config'

// test.serial('describe', t => {
//   const description = {
//     configFiles: ['.babel2rc', 'babel'],
//     loaders: {
//       '.babel2rc': {
//         parse: (content: string) => JSON.parse(content),
//         write: (data: object) => JSON.stringify(data, null, 4)
//       }
//     }
//   }

//   describe('babel', description)

//   t.deepEqual(descriptionOf('babel'), description)
// })

// test.serial('config', async t => {
//   const setting = {
//     presets: ['@babel/core']
//   }

//   await config('babel', () => setting)

//   t.deepEqual(await config('babel'), setting)
// })

// test.after(async () => {
//   await fs.remove({path: '.babel2rc'})
// })
