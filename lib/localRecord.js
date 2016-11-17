const crypto = require('crypto')

class LocalRecord {
  all() {
    const localKeys = Object.keys(localStorage)
    return localKeys.map(key => JSON.parse(localStorage[key]))
  }

  create(record) {
    const formattedRecord = JSON.stringify(record)
    const defaultId = crypto.randomBytes(48).toString('hex')

    return ( reference = defaultId ) => {
      localStorage.setItem(reference, formattedRecord)
    }
  }

  find(reference) {
    const record = localStorage.getItem(reference)

    return JSON.parse(record)
  }

  searchByParams(query, command) {
    const queriedProps = Object.keys(query)

    return this.all()[command](record => {
      return queriedProps.every(key => record[key] === query[key])
    })
  }

  findBy(query) {
    return this.searchByParams(query, 'find')
  }

  where(query) {
    return this.searchByParams(query, 'filter')
  }

  update(record, requestedChange) {
    const keys = Object.keys(requestedChange)

    // find key to reference localStorage
    const recordKey = Object.keys(localStorage).find(k => {
      const existingItem = JSON.parse(localStorage[k])

      // check all props of object to ensure referencing correct obj
      return Object.keys(existingItem).every(key => {
        return existingItem[key] === record[key]
      })
    })

    keys.forEach(key => record[key] = requestedChange[key])

    localStorage.recordKey = record
  }

  destroy(key) {
    localStorage.removeItem(key)
  }
}

module.exports = LocalRecord
