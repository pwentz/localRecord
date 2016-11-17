const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

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
