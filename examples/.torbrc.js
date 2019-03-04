module.exports = [
  ['setup-npm', {
    async git() {
      await this.exec('git', ['init'])
    },
    async npm() {
      await this.exec('npm', ['init', '-y'])
    }
  }],
  ['initialize-lerna', {
    npm: {
      async lerna() {
        await this.exec('lerna', ['init'])

        if (
          await this.prompt({
            type: 'confirm',
            message: 'Use yarn client?'
          })
        ) {
          await this.config('package.json', {
            "workspaces": [
              "packages/*"
            ],
          })
        }
      }
    }
  }],
  ['webpack', {
    npm: {
      async webpack() {
        this.describe('webpack', {
          configFiles: ['webpack.config.js']
        })

        await this.config('webpack', {
          input: () => this.resolve(['src/index.js']),
          output: 'yo.js',
        })

        await this.task({
          watch: 'webpack --watch',
          build: {
            default: async () => require('webpack')(await this.config('webpack')),
            prod: {
              description: 'builds webpack in production mode',
              script: async () => {
                await this.config('webpack', {mode: 'production'})
                return require('webpack')(await this.config('webpack'))
              }
            }
          }
        })
      }
    }
  }],
  [{
    name: 'react',
    description: 'Add react framework support'
  }, {
    npm: {
      async rollup() {
        this.config('rollup', {
          output: {
            name: await this.load('package.json').name,
            file: `./dist/${this.answers['filename']}.cjs.js`
          }
        })
      }
    }
  }]
]
