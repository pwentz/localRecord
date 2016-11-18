const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('findBy', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('match found', () => {
    context('query involves only one prop', () => {
      it('returns the record', () => {
        const record = { height: 'tall', eyes: 'brown' }

        localRecord.create(record)()

        const query = localRecord.findBy({ height: 'tall' })

        assert.deepEqual(record, query)
      })
    })

    context('query passes multiple props', () => {
      it('returns the record that matches all props', () => {
        const similarRecord = { height: 'tall', eyes: 'brown', sex: 'male' }
        const matchingRecord = { height: 'tall', eyes: 'brown', sex: 'female' }

        localRecord.create(matchingRecord)()
        localRecord.create(similarRecord)()

        const query = localRecord.findBy({ height: 'tall', sex: 'female' })

        assert.deepEqual(matchingRecord, query)
      })
    })

    // figure out why order is being jumbled here
    context.skip('multiple records match params', () => {

      it('returns the first entry', () => {
        const initialRecord = { hair: 'green', face: 'red' }
        const matchingRecord = { hair: 'green', face: 'purple' }

        localRecord.create(initialRecord)()
        localRecord.create(matchingRecord)()

        const query = localRecord.findBy({ hair: 'green' })

        assert.deepEqual(query, initialRecord)
      })
    })
  })

  context('no match found', () => {
    it('returns null', () => {
      const nullRecord = localRecord.findBy({ eyes: 'blue' })

      assert.isNull(nullRecord)
    })
  })

  context('parameters passed are not an object', () => {
    it('throws a TypeError', () => {
      const attempt = localRecord.findBy.bind(localRecord, 'hair = blue')

      assert.throws(attempt, Error, 'expected Object, but got String instead')
    })
  })
})
