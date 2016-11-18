const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('where', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('match found', () => {
    context('multiple instances have similar properties', () => {
      it('returns an array of all matching records', () => {
        const recordOne = { height: 'tall', eyes: 'green' }
        const recordTwo = { height: 'tall', eyes: 'brown' }
        const recordThree = { height: 'tall', eyes: 'blue' }

        localRecord.create(recordOne)()
        localRecord.create(recordTwo)()
        localRecord.create(recordThree)()

        const query = localRecord.where({ height: 'tall' })

        assert.sameDeepMembers(query, [recordOne, recordTwo, recordThree])
      })
    })

    context('one record has matching property', () => {
      it('returns an array of matching record', () => {
        const recordOne = { height: 'tall', eyes: 'red' }
        const recordTwo = { height: 'short', eyes: 'indigo' }

        localRecord.create(recordOne)()
        localRecord.create(recordTwo)()

        const query = localRecord.where({ height: 'short' })

        assert.deepEqual(query, [recordTwo])
      })
    })
  })

  context('no match found', () => {
    it('returns an empty array', () => {
      const query = localRecord.where({ hair: 'brown' })

      assert.deepEqual(query, [])
    })
  })

  context('user passes any argument but object', () => {
    it('throws an ArgumentError', () => {
      const attempt = localRecord.where.bind(localRecord, 5)

      assert.throws(attempt, Error, 'expected Object, but got Number instead')
    })
  })
})
