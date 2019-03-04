import {isPlainObject} from 'lodash/fp'
import * as fsExtra from 'fs-extra'
import * as fsEditor from 'mem-fs-editor'
import * as memFs from 'mem-fs'

import {parallel} from './util'

export const fs = {
  exists: parallel(({path}: {path: string}) => fsExtra.pathExists(path)),
  write: parallel(({file, data, options = {spaces: 2}}: {file: string; data: any; options?: any}) => fsExtra.ensureFile(file).then(() => (isPlainObject(data) ? fsExtra.writeJSON : fsExtra.writeFile)(file, data, options))),
  read: parallel(({file}: {file: string | number | Buffer}) => fsExtra.readFile(file).then(val => val.toString('utf8'))),
  copy: parallel(({src, dest}: {src: string; dest: string}) => fsExtra.copy(src, dest)),
  remove: parallel(({path}: {path: string}) => fsExtra.remove(path)),
  move: parallel(({src, dest, opt = {}}: {src: string; dest: string; opt?: any}) => fsExtra.move(src, dest, opt)),
  mkdir: parallel(({path}: {path: string}) => fsExtra.ensureDir(path)),
  emptydir: parallel(({path}: {path: string}) => fsExtra.emptyDir(path)),
  ejs: parallel(
    ({src, dest, context, tplOptions = {}, options = {}, opt = {}}: {src: string; dest: string; context: any; tplOptions?: any; options?: any; opt?: any}) =>
      new Promise(resolve => {
        const editor = fsEditor.create(memFs.create())
        editor.copyTpl(src, dest, context, tplOptions, {...options, ...opt})
        editor.commit(resolve)
      })
  )
}
