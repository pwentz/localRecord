const crypto = require('crypto')
const errors = require('./helpers/errors')
const helpers = require('./helpers/queryHelpers')

process.on('uncaughtException', err => console.log(err))

class LocalRecord {
  all() {
    const localKeys = Object.keys(localStorage)
    return localKeys.map(key => JSON.parse(localStorage[key]))
  }

  create(record) {
    const formattedRecord = JSON.stringify(record)
    const defaultId = crypto.randomBytes(6).toString('hex')

    // throw error if argument is not an Object
    if (this.paramsAreNotValid(record)) {
      throw errors.invalidParams(record)
    }

    return ( reference = defaultId ) => {
      const existingRecord = this.findBy(record)
      const doesRecordExist = existingRecord &&
                                helpers.doAllPropsMatch(existingRecord, record)

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
    const key = helpers.findMatchingKey(record)

    Object.keys(newProps).forEach(prop => record[prop] = newProps[prop])

    localStorage[key] = JSON.stringify(record)
    return record
  }

  find(reference) {
    const record = localStorage.getItem(reference)

    return JSON.parse(record)
  }

  paramsAreNotValid(query) {
    return query.constructor.name !== 'Object'
  }

  findBy(query) {
    if (this.paramsAreNotValid(query)) {
      throw errors.invalidParams(query)
    }

    return helpers.searchByParams(query, this.all(), 'find')
  }

  where(query) {
    if (this.paramsAreNotValid(query)) {
      throw errors.invalidParams(query)
    }

    return helpers.searchByParams(query, this.all(), 'filter')
  }

  update(record, newProps) {
    const recordKey = helpers.findMatchingKey(record)

    // throw error first if record does not exist
    if (!recordKey) throw errors.noExistingRecord()

    const unknownProperty = Object.keys(newProps).find(prop => {
      return !Object.keys(record).includes(prop)
    })

    // throw error second if argument is not an object
    if (this.paramsAreNotValid(newProps)) throw errors.invalidParams(newProps)

    // throw last error if props don't exist on object
    if (unknownProperty) throw errors.unknownProperty(unknownProperty)

    Object.keys(newProps).forEach(key => record[key] = newProps[key])

    localStorage[recordKey] = JSON.stringify(record)
    return record
  }

  destroy(record) {
    const key = helpers.findMatchingKey(record)

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
