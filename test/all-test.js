const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('all', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  context('there are records in localStorage', () => {
    it('returns an array of all items in localStorage', () => {
      const recordOne = { height: 'tall', hair: 'none' }
      const recordTwo = { eyes: 'blue' }
      const recordThree = { contacts: 4, friends: ['James', 'Tina', 'Wendy'] }

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
