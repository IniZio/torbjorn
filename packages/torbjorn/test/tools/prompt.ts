// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava'

import {prompt} from '../../src/tools/prompt'

test('prompt', async t => {
  prompt.inject(['a1'])
  const response = await prompt({
    type: 'text',
    name: 'q1',
    message: 'Question 1'
  })

  t.is(response.q1, 'a1')
})

