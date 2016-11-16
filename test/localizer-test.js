const assert = require('chai').assert
const Localizer = require('./../lib/localizer')

describe('Localizer', () => {
  const localizer = new Localizer()
  beforeEach(() => localStorage.clear())

  describe('find', () => {
    // find record by provided reference
    // provided reference is preferrable to retrieve strings, integers, or arrays
    context('user provides a reference', () => {
      context('record is a string', () => {
        it('retrieves the item', () => {
          const formattedItem = JSON.stringify('my string record')
          localStorage.setItem('record reference', formattedItem)

          const query = localizer.find('record reference')

          assert.equal(query, 'my string record')
        })
      })

      context('record is an array', () => {
        it('retrieves the item in its original format', () => {
          const record = ['record 1', 'record 2', 'record 3']
          localStorage.setItem('record reference', JSON.stringify(record))

          const query = localizer.find('record reference')

          assert.deepEqual(query, record)
        })
      })

      context('record is an object', () => {
        it('retrives the item in its original format', () => {
          const record = { recordOne: 'thing 1', recordTwo: 'thing 2' }

          localStorage.setItem('my record', JSON.stringify(record))

          const query = localizer.find('my record')

          assert.deepEqual(query, record)
        })
      })

      context('record is an integer', () => {
        it('retrieves the item in its original format', () => {
          const record = 1

          localStorage.setItem('my integer', JSON.stringify(record))

          const query = localizer.find('my integer')

          assert.equal(query, record)
        })
      })

      context('record is a float', () => {
        it('retrieves the item in its original format', () => {
          const record = 1.43522

          localStorage.setItem('my float', JSON.stringify(record))

          const query = localizer.find('my float')

          assert.equal(query, record)
        })
      })
    })
  })

  describe('create', () => {
    // create can be user w/ or without a reference
    context('user does not provide reference', () => {
      it('saves the object', () => {
        const record = { recordOne: 'thing 1', recordTwo: 'thing 2'}

        const createRecord = localizer.create(record)

        assert.equal(localStorage.length, 0)

        createRecord()

        assert.equal(localStorage.length, 1)
      })
    })

    context('user provides reference', () => {
      context('record is a string', () => {
        it('stores the string', () => {
          const record = 'it creates!'

          localizer.create(record)('create')

          const query = localizer.find('create')

          assert.equal(query, 'it creates!')
        })
      })

      context('record is an array', () => {
        it('stores the array', () => {
          const record = ['record 1', 'record 2']

          localizer.create(record)('myArray')

          const query = localizer.find('myArray')

          assert.deepEqual(query, record)
        })
      })

      context('record is an object', () => {
        it('stores the object', () => {
          const record = { recordOne: 'thing 1', recordTwo: 'thing 2'}

          localizer.create(record)('myObject')

          const query = localizer.find('myObject')

          assert.deepEqual(query, record)
        })
      })

      context('record is an integer', () => {
        it('stores the integer', () => {
          const record = 4

          localizer.create(record)('myInteger')

          const query = localizer.find('myInteger')

          assert.equal(query, record)
        })
      })

      context('record is a float', () => {
        it('stores the float', () => {
          const record = 9.232

          localizer.create(record)('myFloat')

          const query = localizer.find('myFloat')

          assert.equal(query, record)
        })
      })
    })
  })

  // when no reference is provided, use findBy to look via properies
  describe('findBy', () => {
    context('record is object', () => {
      context('query involves only one prop', () => {
        it('returns the record', () => {
          const record = { height: 'tall', eyes: 'brown' }

          localizer.create(record)()

          const query = localizer.findBy({ height: 'tall' })

          assert.deepEqual(record, query)
        })
      })

      context('query passes multiple props', () => {
        it('returns the record that matches all props', () => {
          const similarRecord = { height: 'tall', eyes: 'brown', sex: 'male' }
          const matchingRecord = { height: 'tall', eyes: 'brown', sex: 'female' }

          localizer.create(matchingRecord)()
          localizer.create(similarRecord)()

          const query = localizer.findBy({ height: 'tall', sex: 'female' })

          assert.deepEqual(matchingRecord, query)
        })
      })
    })

    context('record is array or string', () => {
      it('can query by length', () => {
        const record = [2, 3, 4, 5, 6]

        localizer.create(record)()

        const query = localizer.findBy({ length: 5 })

        assert.deepEqual(query, record)
      })
    })

    context('multiple records match params', () => {
      it('returns the first entry', () => {
        const initialRecord = [1, 2, 3]
        const matchingRecord = '123'

        localizer.create(initialRecord)()
        localizer.create(matchingRecord)()

        const query = localizer.findBy({ length: 3 })

        assert.deepEqual(query, initialRecord)
      })
    })
  })

  describe('where', () => {
    context('multiple instances have similar properties', () => {
      it('returns an array of all matching records', () => {
        const recordOne = { height: 'tall', eyes: 'green' }
        const recordTwo = { height: 'tall', eyes: 'brown' }
        const recordThree = { height: 'tall', eyes: 'blue' }

        localizer.create(recordOne)()
        localizer.create(recordTwo)()
        localizer.create(recordThree)()

        const query = localizer.where({ height: 'tall' })

        assert.sameDeepMembers(query, [recordOne, recordTwo, recordThree])
      })
    })

    context('one record has matching property', () => {
      it('returns an array of matching record', () => {
        const recordOne = { height: 'tall', eyes: 'red' }
        const recordTwo = { height: 'short', eyes: 'indigo' }

        localizer.create(recordOne)()
        localizer.create(recordTwo)()

        const query = localizer.where({ height: 'short' })

        assert.deepEqual(query, [recordTwo])
      })
    })
  })
})
