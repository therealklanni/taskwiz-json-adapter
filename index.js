import bug from 'debug'
const debug = bug('taskwiz:json-adapter')

import os from 'os'
import fs from 'fs'
import path from 'path'
import { createInterface } from 'readline'
import tempfile from 'tempfile'
import _ from 'highland'

const fromJSON = x => JSON.parse(x)
const toBuffer = x => new Buffer(`${JSON.stringify(x)}\n`)

const createLineReaderStream = file => {
  const stream = _()

  createInterface({ input: fs.createReadStream(file) })
    .on('line', line => stream.write(line))
    .on('close', () => stream.end())

  return stream
}

class Adapter {
  constructor (options = {}) {
    this.path = options.path || path.join(os.homedir(), '.taskwiz', 'tasks.json')

    debug('Constructor', this)
  }

  findOrCreatePath () {
    return new Promise((res, rej) => {
      fs.stat(this.path, (err, stats) => {
        if (err) {
          // Task file does not exist
          debug(`Unable to stat ${this.path}`, err.message)
          const dirname = path.dirname(this.path)

          // Check if containing directory exists
          fs.stat(dirname, (err, stats) => {
            if (err) {
              // Containing directory does not exist
              debug(`Unable to stat ${dirname}`, err.message)

              // Attempt to create the directory
              try {
                fs.mkdirSync(dirname, 0o755)
              } catch (e) {
                debug(`Unable to create ${dirname}`, e.message)
                return rej(e)
              }
            }

            // Create Task file
            fs.writeFile(this.path, '', { mode: 0o644 }, err => {
              if (err) {
                debug(`Unable to open ${this.path} for writing`, err.message)
                return rej(err)
              }

              debug(`Created new task file: ${this.path}`)
              return res(this.path)
            })
          })
        } else {
          debug(`${this.path} stats`, stats)
          return res(this.path)
        }
      })
    })
  }

  create (task) {
    debug('Create', task)
    return new Promise((res, rej) => {
      this.findOrCreatePath().then(taskFile => {
        const temp = tempfile()
        debug(`tempfile: ${temp}`)

        fs.createReadStream(taskFile).pipe(fs.createWriteStream(temp))

        createLineReaderStream(taskFile)
          .map(fromJSON)
          .findWhere({ uuid: task.uuid })
          .toArray(a => {
            debug('toArray', a)

            if (a.length) {
              debug(`${task.uuid} exists`)
              rej(new Error('Duplicate uuid'))
              fs.unlink(temp)
            } else {
              debug(`${task.uuid} not found, writing to file`)
              const output = fs.createWriteStream(taskFile, { mode: 0o644 })
                .on('finish', () => {
                  debug(`Updated ${taskFile} written`)
                  res(task)
                  fs.unlink(temp)
                })

              createLineReaderStream(temp)
                .map(fromJSON)
                .append(task)
                .map(toBuffer)
                .pipe(output)
            }
          })
      })
    })
  }

  read (uuid) {
    debug(`Read ${uuid}`)
    return new Promise((res, rej) => {
      this.findOrCreatePath().then(taskFile => {
        _(fs.createReadStream(taskFile))
          .map(fromJSON)
          .flatten()
          .findWhere({ uuid })
          .toArray(a =>
            a.length ? res(a[0]) : rej(new Error(`Not found: ${uuid}`)))
      })
    })
  }

  update (task) {
    debug(`Update ${task.uuid}`)
    return Promise.reject(new Error('Not implemented'))
  }

  delete (uuid) {
    debug(`Delete ${uuid}`)
    return Promise.reject(new Error('Not implemented'))
  }
}

export default (...args) => new Adapter(...args)
