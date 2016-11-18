const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('createProperty', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('user passes an object w/ one prop', () => {
    it('adds the property', () => {
      const existingRecord = { height: 'short' }

      localRecord.create(existingRecord)('myRecord')
      localRecord.createProperty(existingRecord, { hair: 'brown' })

      const retrievedRecord = localRecord.find('myRecord')

      assert.deepEqual(retrievedRecord, { height: 'short', hair: 'brown' })
    })
  })

  context('user passes an object w/ many props', () => {
    it('tacks on all properties', () => {
      const existingRecord = { height: 'short' }
      const manyNewProperties = { hair: 'brown', eyes: 'green', age: 'old' }

      localRecord.create(existingRecord)('myRecord')
      localRecord.createProperty(existingRecord, manyNewProperties)

      const retrievedRecord = localRecord.find('myRecord')

      assert.deepEqual(retrievedRecord, Object.assign(existingRecord, manyNewProperties))
    })
  })

  it('returns the updated object', () => {
    const existingRecord = { height: 'short' }

    localRecord.create(existingRecord)('myRecord')
    const newRecord = localRecord.createProperty(existingRecord, { hair: 'brown' })

    assert.deepEqual(newRecord, { height: 'short', hair: 'brown' })
  })
})
