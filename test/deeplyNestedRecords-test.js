const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('Nested Records', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  context('One level deep', () => {
    it('can retrieve created object in same condition', () => {
      const nestedRecord = { contacts: 48, names: ['Fred', 'Mary', 'Linda'] }

      localRecord.create(nestedRecord)('testRec')

      const retrievedRecord = localRecord.find('testRec')

      assert.deepEqual(nestedRecord, retrievedRecord)
    })
  })

  context('Two levels deep', () => {
    it('can retrieve created object in same condition', () => {
      const nestedRecord = { contacts: 48,
                             friends: [ { name: 'Phil', sex: 'male' },
                                        { name: 'Wendy', sex: 'female' },
                                        { name: 'Sophia', sex: 'female' } ] }

      localRecord.create(nestedRecord)('testRec')

      const retrievedRecord = localRecord.find('testRec')

      assert.deepEqual(nestedRecord, retrievedRecord)
    })
  })

  context('Three or more levels deep', () => {
    it('retrieves created object in same condition', () => {
      const nestedRecord = { contacts: 48,
                             friends: [ { name: 'Phil', kids: [{ name: 'Phil, Jr.', age: 7 },
                                                               { name: 'Tina', age: 12 }] },
                                        { name: 'Wendy', kids: [{ name: 'Brad', age: 16 },
                                                                { name: 'Thad', age: 16 }] },
                                        { name: 'Sophia', kids: [{ name: 'Amy', age: 3 },
                                                                 { name: 'Greg', age: 21 }] } ] }

      localRecord.create(nestedRecord)('testRec')

      const retrievedRecord = localRecord.find('testRec')

      assert.deepEqual(nestedRecord, retrievedRecord)
    })
  })
})
