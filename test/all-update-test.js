const assert = require('chai').assert
const chai = require('chai')
const LocalRecord = require('./../lib/localRecord')

describe('all', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('there are records in localStorage', () => {
    it('returns an array of all items in localStorage', () => {
      const recordOne = { height: 'tall', hair: 'none' }
      const recordTwo = 'wowowowo'
      const recordThree = ['thing one', { eyes: 'blue' }, 5]

      localRecord.create(recordOne)()
      localRecord.create(recordTwo)()
      localRecord.create(recordThree)()

      assert.sameDeepMembers(localRecord.all(), [recordOne, recordTwo, recordThree])
    })
  })

  context('there are no records in localStorage', () => {
    it('returns an empty array', () => {
      assert.deepEqual(localRecord.all(), [])
    })
  })
})

describe('update', () => {
  // ADD EDGE CASES
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

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
    it('throws an error', () => {
      const record = { height: 'tall' }
      const query = localRecord.update.bind(localRecord, record, { height: 'short' })

      assert.throws(query, ReferenceError, 'record does not exist')
    })
  })
})
