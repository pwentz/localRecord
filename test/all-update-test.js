const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('all', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

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

describe('update', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('record is an object', () => {
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
  })
})
