const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('update', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  context('on success', () => {
    it('returns the updated record', () => {
      const record = { height: 'short' }

      localRecord.create(record)()

      const updatedRecord = localRecord.update(record, { height: 'tall' })

      assert.deepEqual(updatedRecord, { height: 'tall' })
    })
  })


  context('params match properties on object', () => {
    it('takes the record, and an object of updated properties', () => {
      const record = { height: 'tall', hair: 'brown' }

      localRecord.create(record)()

      localRecord.update(record, { height: 'short' })

      assert.deepEqual(record, { height: 'short', hair: 'brown' })
    })

  })

  context('params do not match properties on object', () => {
    it('creates additional properties for that object', () => {
      const record = { height: 'tall' }

      localRecord.create(record)()

      localRecord.update(record, { eyes: 'green' })

      assert.deepEqual(record, { height: 'tall', eyes: 'green' })
    })
  })

  context('record does not exist', () => {
    it('throws a ReferenceError', () => {
      const record = { height: 'tall' }
      const query = localRecord.update.bind(localRecord, record, { height: 'short' })

      assert.throws(query, ReferenceError, 'record does not exist')
    })
  })

  context('user passes anything but an object', () => {
    it('throws a TypeError', () => {
      const record = { height: 'tall' }

      localRecord.create(record)()

      const attempt = localRecord.update.bind(localRecord, record, [{ height: 'short' }])

      assert.throws(attempt, TypeError, 'expected Object, but got Array instead')
    })
  })
})
