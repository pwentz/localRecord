const crypto = require('crypto')
const errors = require('./helpers/errors')

process.on('uncaughtException', err => console.log(err))

class LocalRecord {
  all() {
    const localKeys = Object.keys(localStorage)
    return localKeys.map(key => JSON.parse(localStorage[key]))
  }

  create(record) {
    const formattedRecord = JSON.stringify(record)
    const defaultId = crypto.randomBytes(48).toString('hex')

    // throw error if argument is not an Object
    if (this.paramsAreNotValid(record)) {
      throw errors.invalidParams(record)
    }

    return ( reference = defaultId ) => {
      const existingRecord = this.findBy(record)
      const doesRecordExist = existingRecord &&
                                this.doAllPropsMatch(existingRecord, record)

      // return false if matching record already exists
      // or reference is already taken
      if (doesRecordExist || this.find(reference)) {
        return false
      }

      localStorage.setItem(reference, formattedRecord)
      return record
    }
  }

  createProperty(record, newProps) {
    const key = this.findMatchingKey(record)

    Object.keys(newProps).forEach(prop => record[prop] = newProps[prop])

    localStorage[key] = JSON.stringify(record)
    return record
  }

  doAllPropsMatch(comparingRecord, record) {
    const keys = Object.keys(comparingRecord)

    const doesExistingEntryMatch = keys.every(key => {
      return comparingRecord[key] === record[key]
    })

    return doesExistingEntryMatch
  }

  find(reference) {
    const record = localStorage.getItem(reference)

    return JSON.parse(record)
  }

  searchByParams(query, command) {
    const match = this.all()[command](record => {
      return this.doAllPropsMatch(query, record)
    })

    if (match) return match
      return null
  }

  paramsAreNotValid(query) {
    return query.constructor.name !== 'Object'
  }

  findBy(query) {
    if (this.paramsAreNotValid(query)) {
      throw errors.invalidParams(query)
    }

    return this.searchByParams(query, 'find')
  }

  where(query) {
    if (this.paramsAreNotValid(query)) {
      throw errors.invalidParams(query)
    }

    return this.searchByParams(query, 'filter')
  }

  findMatchingKey(record) {
    return Object.keys(localStorage).find(key => {
      const existingItem = JSON.parse(localStorage[key])

      // check all props of object to ensure referencing correct obj
      return this.doAllPropsMatch(existingItem, record)
    })
  }

  update(record) {
    const recordKey = this.findMatchingKey(record)

    // throw error on first fn call if record does not exist
    if (!recordKey) throw errors.noExistingRecord()

    return newProps => {

      const unknownProperty = Object.keys(newProps).find(prop => {
        return !Object.keys(record).includes(prop)
      })

      // throw error if second argument is not an object
      if (this.paramsAreNotValid(newProps)) throw errors.invalidParams(newProps)
      // throw error if property does not exist on object
      if (unknownProperty) throw errors.unknownProperty(unknownProperty)

      Object.keys(newProps).forEach(key => record[key] = newProps[key])

      localStorage.recordKey = JSON.stringify(record)
      return record
    }
  }

  destroy(record) {
    const key = this.findMatchingKey(record)

    if (!key) {
      throw errors.noExistingRecord()
    }

    localStorage.removeItem(key)
    return record
  }

  destroyAll() {
    const lostRecords = this.all()
    localStorage.clear()

    return lostRecords
  }
}

module.exports = LocalRecord
