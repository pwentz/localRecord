const assert = require('chai').assert
const Localizer = require('./../lib/localizer')

describe('all', () => {
  const localizer = new Localizer()
  beforeEach(() => localStorage.clear())

  it('returns an array of all items in localStorage', () => {
    const recordOne = { height: 'tall', hair: 'none' }
    const recordTwo = 'wowowowo'
    const recordThree = ['thing one', { eyes: 'blue' }, 5]

    localizer.create(recordOne)()
    localizer.create(recordTwo)()
    localizer.create(recordThree)()

    assert.sameDeepMembers(localizer.all(), [recordOne, recordTwo, recordThree])
  })
})

describe('update', () => {
  const localizer = new Localizer()
  beforeEach(() => localStorage.clear())

  context('record is an object', () => {
    context('params match properties on object', () => {
      it('takes the record, and an object of updated properties', () => {
        const record = { height: 'tall', hair: 'brown' }

        localizer.create(record)()

        localizer.update(record, { height: 'short' })

        assert.deepEqual(record, { height: 'short', hair: 'brown' })
      })
    })

    context('params do not match properties on object', () => {
      it('creates additional properties for that object', () => {
        const record = { height: 'tall' }

        localizer.create(record)()

        localizer.update(record, { eyes: 'green' })

        assert.deepEqual(record, { height: 'tall', eyes: 'green' })
      })
    })
  })
})
