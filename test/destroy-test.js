const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('destroy', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('record exists', () => {
    it('removes object from localStorage', () => {
      const record = { height: 'short', eyes: 'hazel' }

      localRecord.create(record)()
      assert.equal(localStorage.length, 1)

      localRecord.destroy(record)

      assert.equal(localStorage.length, 0)
    })

    it('returns the removed object', () => {
      const record = { height: 'short' }

      localRecord.create(record)()

      const forgottenRecord = localRecord.destroy(record)

      assert.deepEqual(record, forgottenRecord)
    })
  })

  context('record does not exist', () => {
    it('throws a ReferenceError', () => {
      const record = { height: 'short', eyes: 'brown' }

      const attempt = localRecord.destroy.bind(localRecord, record)

      assert.throws(attempt, ReferenceError, 'record does not exist')
    })
  })
})
