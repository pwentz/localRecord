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

      localRecord.create(record)('myRecord')

      localRecord.update(record, { height: 'short' })
      const foundRecord = localRecord.find('myRecord')

      assert.deepEqual(foundRecord, { height: 'short', hair: 'brown' })
    })

    it('does not create another object', () => {
      const record = { height: 'tall', hair: 'brown' }

      localRecord.create(record)('myRecord')

      localRecord.update(record, { height: 'short' })

      assert.equal(localStorage.length, 1)
    })

  })

  context('params do not match properties on object', () => {
    it('throws an UnknownAttribute error', () => {
      const record = { height: 'tall' }

      localRecord.create(record)()

      const attempt = localRecord.update.bind(localRecord, record, { eyes: 'green' })

      assert.throws(attempt, Error, "unknown property 'eyes' for record")
    })
  })

  context('record does not exist', () => {
    it('throws a ReferenceError', () => {
      const record = { height: 'tall' }
      const query = localRecord.update.bind(localRecord, record)

      assert.throws(query, ReferenceError, 'record does not exist')
    })
  })

  context('user passes anything but an object', () => {
    it('throws an ArgumentError on second function call', () => {
      const record = { height: 'tall' }

      localRecord.create(record)()

      const attempt = localRecord.update.bind(localRecord, record, [{ height: 'short' }])

      assert.throws(attempt, Error, 'expected Object, but got Array instead')
    })
  })
})
