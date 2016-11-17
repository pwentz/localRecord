const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('find', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('match is found', () => {
    // find record by provided reference
    context('user provides a reference', () => {
      it('retrives the item in its original format', () => {
        const record = { recordOne: 'thing 1', recordTwo: 'thing 2' }

        localStorage.setItem('my record', JSON.stringify(record))

        const query = localRecord.find('my record')

        assert.deepEqual(query, record)
      })
    })
  })

  context('no match is found', () => {
    it('returns null', () => {
      assert.isNull(localRecord.find('myRecord'))
    })
  })
})
