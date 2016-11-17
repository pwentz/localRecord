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

describe('destroyAll', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('records in storage', () => {
    it('removes everything from localStorage', () => {
      const recordOne = { face: 'green', height: 'short' }
      const recordTwo = { height: 'normal', face: 'red', beard: 'white' }
      const recordThree = { face: 'red', height: 'short' }

      localRecord.create(recordOne)()
      localRecord.create(recordTwo)()
      localRecord.create(recordThree)()

      localRecord.destroyAll()

      assert.equal(localStorage.length, 0)
    })

    it('returns all the destroyed record', () => {
      const recordOne = { face: 'green', height: 'short' }
      const recordTwo = { height: 'normal', face: 'red', beard: 'white' }
      const recordThree = { face: 'red', height: 'short' }

      localRecord.create(recordOne)()
      localRecord.create(recordTwo)()
      localRecord.create(recordThree)()

      const forgottenRecords = localRecord.destroyAll()

      console.log(forgottenRecords)
      assert.sameDeepMembers(forgottenRecords, [recordOne, recordTwo, recordThree])
    })
  })

  context('no records in storage', () => {
    it('returns an empty array', () => {
      const blankRecords = localRecord.destroyAll()

      assert.deepEqual(blankRecords, [])
    })
  })
})
