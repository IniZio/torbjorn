// eslint-disable-next-line @typescript-eslint/no-var-requires
const {declare} = require('../packages/torbjorn')

module.exports = declare(({prompt, action, fs}) => [
  ['console.log', 'hello world XD'],
  ['action', {
    name: 'ABC',
    call() {
      console.log('claling ABC')
    }
  }],
  ['action',
    // eslint-disable-next-line func-names
    function CDE() {
      console.log('now at CDE')
    }],
  ['action', {
    name: 'poi',
    call: [
      ['prompts', [{
        type: 'text',
        name: 'tips',
        message: 'Buy me a coffee'
      }]],
      ['console.log', 'So you gave me $<%= tips %>']
    ]
  }],
  ['include', 'sdffsdf', {
    only: ['dsd']
  }]
])
