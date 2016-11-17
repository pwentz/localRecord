const assert = require('chai').assert
const LocalRecord = require('./../lib/localRecord')

describe('LocalRecord', () => {
  const localRecord = new LocalRecord()
  beforeEach(() => localStorage.clear())

  describe('find', () => {
    context('match is found', () => {
      // find record by provided reference
      // provided reference is preferrable to retrieve strings, integers, or arrays
      context('user provides a reference', () => {
        context.skip('record is an array', () => {
          it('retrieves the item in its original format', () => {
            const record = ['record 1', 'record 2', 'record 3']
            localStorage.setItem('record reference', JSON.stringify(record))

            const query = localRecord.find('record reference')

            assert.deepEqual(query, record)
          })
        })

        context('record is an object', () => {
          it('retrives the item in its original format', () => {
            const record = { recordOne: 'thing 1', recordTwo: 'thing 2' }

            localStorage.setItem('my record', JSON.stringify(record))

            const query = localRecord.find('my record')

            assert.deepEqual(query, record)
          })
        })
      })
    })

    context('no match is found', () => {
      it('returns null', () => {
        assert.isNull(localRecord.find('myRecord'))
      })
    })
  })

  describe('create', () => {
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
      // context('record is a string', () => {
      //   it('stores the string', () => {
      //     const record = 'it creates!'

      //     localRecord.create(record)('create')

      //     const query = localRecord.find('create')

      //     assert.equal(query, 'it creates!')
      //   })
      // })

      // context('record is an array', () => {
      //   it('stores the array', () => {
      //     const record = ['record 1', 'record 2']

      //     localRecord.create(record)('myArray')

      //     const query = localRecord.find('myArray')

      //     assert.deepEqual(query, record)
      //   })
      // })

      context('record is an object', () => {
        it('stores the object', () => {
          const record = { recordOne: 'thing 1', recordTwo: 'thing 2'}

          localRecord.create(record)('myObject')

          const query = localRecord.find('myObject')

          assert.deepEqual(query, record)
        })
      })

      // context('record is an integer', () => {
      //   it('stores the integer', () => {
      //     const record = 4

      //     localRecord.create(record)('myInteger')

      //     const query = localRecord.find('myInteger')

      //     assert.equal(query, record)
      //   })
      // })

      // context('record is a float', () => {
      //   it('stores the float', () => {
      //     const record = 9.232

      //     localRecord.create(record)('myFloat')

      //     const query = localRecord.find('myFloat')

      //     assert.equal(query, record)
      //   })
      // })
    })

    context('record reference is already taken', () => {
      it('returns null', () => {
        const existingRecord = { height: 'tall', hair: 'brown' }
        const newRecord = { name: 'James' }

        localRecord.create(existingRecord)('myRecord')
        const creationAttempt = localRecord.create(newRecord)

        assert.isNull(creationAttempt('myRecord'))
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
      it('throws an error', () => {
        const existingRecord = { height: 'tall', hair: 'brown' }
        const duplicateRecord = { height: 'tall', hair: 'brown' }

        localRecord.create(existingRecord)('myRecord')
        const attempt = localRecord.create(duplicateRecord)

        assert.throws(attempt, Error, 'record already exists')
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
  })

  // when no reference is provided, use findBy to look via properies
  describe('findBy', () => {
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

      context.skip('record is array', () => {
        it('can query by length', () => {
          const record = [2, 3, 4, 5, 6]

          localRecord.create(record)()

          const query = localRecord.findBy({ length: 5 })

          assert.deepEqual(query, record)
        })
      })

      context('multiple records match params', () => {
        it('returns the first entry', () => {
          const initialRecord = [1, 2, 3]
          const matchingRecord = '123'

          localRecord.create(initialRecord)()
          localRecord.create(matchingRecord)()

          const query = localRecord.findBy({ length: 3 })

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
  })

  describe('where', () => {
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
  })
})
