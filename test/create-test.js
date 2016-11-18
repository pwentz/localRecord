const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('create', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('on success', () => {
    it('returns the created object', () => {
      const record = { recordOne: 'thing 1', recordTwo: 'thing 2'}

      const createdRecord = localRecord.create(record)()

      assert.deepEqual(record, createdRecord)
    })
  })
  // create can be user w/ or without a reference
  context('user does not provide reference', () => {
    it('saves the object', () => {
      const record = { recordOne: 'thing 1', recordTwo: 'thing 2'}

      const createRecord = localRecord.create(record)

      assert.equal(localStorage.length, 0)

      createRecord()

      assert.equal(localStorage.length, 1)
    })
  })

  context('user provides reference', () => {
    it('stores the object', () => {
      const record = { recordOne: 'thing 1', recordTwo: 'thing 2'}

      localRecord.create(record)('myObject')

      const query = localRecord.find('myObject')

      assert.deepEqual(query, record)
    })
  })

  context('record reference is already taken', () => {
    it('returns false on second call', () => {
      const existingRecord = { height: 'tall', hair: 'brown' }
      const newRecord = { name: 'James' }

      localRecord.create(existingRecord)('myRecord')
      const creationAttempt = localRecord.create(newRecord)

      assert.isFalse(creationAttempt('myRecord'))
    })

    it('does not add record to localStorage', () => {
      const existingRecord = { height: 'tall', hair: 'brown' }
      const newRecord = { name: 'James' }

      localRecord.create(existingRecord)('myRecord')
      localRecord.create(newRecord)('myRecord')

      assert.equal(localStorage.length, 1)
    })
  })

  context('matching record already in localStorage', () => {
    it('returns false on second call', () => {
      const existingRecord = { height: 'tall', hair: 'brown' }
      const duplicateRecord = { height: 'tall', hair: 'brown' }

      localRecord.create(existingRecord)()
      const attempt = localRecord.create(duplicateRecord)

      assert.isFalse(attempt())
    })
  })

  context('existing record with one, but not all matching attrs', () => {
    it('creates similar record', () => {
      const existingRecord = { height: 'tall', hair: 'red' }
      const similarRecord = { height: 'tall' }

      localRecord.create(existingRecord)('myRecord')
      localRecord.create(similarRecord)()

      assert.equal(localStorage.length, 2)
    })
  })

  context('new record with one, but not all attrs matching existing', () => {
    it('creates the record', () => {
      const existingRecord = { height: 'tall' }
      const similarRecord = { height: 'tall', hair: 'red' }

      localRecord.create(existingRecord)('myRecord')
      localRecord.create(similarRecord)()

      assert.equal(localStorage.length, 2)
    })
  })

  context('user tries to pass anything but an object', () => {
    it('throws an ArgumentError on first function', () => {
      const falseRecord = ['one', 'two', 'three']

      const falseAttempt = localRecord.create.bind(localRecord, falseRecord)

      assert.throws(falseAttempt, Error, 'expected Object, but got Array instead')
    })
  })
})
