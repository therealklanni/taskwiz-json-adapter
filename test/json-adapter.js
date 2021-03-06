import fs from 'fs'
import test from 'ava'
import jsonAdapter from '../'

const cleanup = () => {
  try { fs.unlinkSync(adapter.path) }
  catch (e) {}
}

const adapter = jsonAdapter({ path: './tasks.json' })
const task = { uuid: '0f52edbe-1393-4f1e-8463-c23295b957a2' }

test.after('cleanup', cleanup)

test.cb('findOrCreatePath method creates task file', t => {
  cleanup() // ensure ENOENT

  adapter.findOrCreatePath().then((filePath) => {
    fs.stat(filePath, (err) => {

      if (err) {
        t.fail(err.message)
      } else {
        t.pass()
      }

      t.same(adapter.path, filePath)
      t.end()
    })
  })
})

test('create method', t => {
  return adapter.create(task).then(result => {
    t.same(result, task)
    t.doesNotThrow(adapter.read(task.uuid))
  })
})

test('read method', t => {
  return adapter.read(task.uuid).then(result => {
    t.same(result.uuid, task.uuid)
  })
})

// test.skip('update method', t => {
//   const updatedTask = { status: 'pending', ...task }
//
//   return adapter.update(updatedTask).then(result => {
//     t.same(result, updatedTask)
//   })
// })
//
// test.skip('delete method', t => {
//   return adapter.delete(task.uuid).then(() => {
//     t.throws(adapter.read(task.uuid), /Not found/)
//   })
// })

test('rejects', async t => {
  t.throws(adapter.create(task), /Duplicate uuid/)
  t.throws(adapter.read('abc'), /Not found/)
  // t.throws(adapter.update({ uuid: 'abc' }), /Not found/)
})
