const crypto = require('crypto')

process.on('uncaughtException', err => console.log(err))

class LocalRecord {
  all() {
    const localKeys = Object.keys(localStorage)
    return localKeys.map(key => JSON.parse(localStorage[key]))
  }

  create(record) {
    const formattedRecord = JSON.stringify(record)
    const defaultId = crypto.randomBytes(48).toString('hex')
    const existingRecord = this.findBy(record)

    // if matching record already exists, throw error
    if (existingRecord && this.doAllKeysMatch(existingRecord, record)) {
      throw new Error('record already exists')
    }

    return ( reference = defaultId ) => {
      // if duplicate reference/ID already exists, return unll
      if (this.find(reference)) { return null }

      localStorage.setItem(reference, formattedRecord)
      return record
    }
  }

  doAllKeysMatch(comparingRecord, record) {
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
      return this.doAllKeysMatch(query, record)
    })

    if (match) return match
      return null
  }

  findBy(query) {
    return this.searchByParams(query, 'find')
  }

  where(query) {
    return this.searchByParams(query, 'filter')
  }

  findMatchingKey(record) {
    return Object.keys(localStorage).find(key => {
      const existingItem = JSON.parse(localStorage[key])

      // check all props of object to ensure referencing correct obj
      return this.doAllKeysMatch(existingItem, record)
    })
  }

  update(record, requestedChange) {
    const keys = Object.keys(requestedChange)

    const recordKey = this.findMatchingKey(record)

    if (!recordKey) {
      throw new ReferenceError('record does not exist')
    }

    keys.forEach(key => record[key] = requestedChange[key])

    localStorage.recordKey = record
    return record
  }

  destroy(record) {
    const key = this.findMatchingKey(record)

    if (!key) {
      throw new ReferenceError('record does not exist')
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
