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

    return ( reference = defaultId ) => {
      if (localStorage[reference]) { return null }
      else {
        localStorage.setItem(reference, formattedRecord)
      }
    }
  }

  find(reference) {
    const record = localStorage.getItem(reference)

    return JSON.parse(record)
  }

  searchByParams(query, command) {
    const queriedProps = Object.keys(query)

    const match = this.all()[command](record => {
      return queriedProps.every(key => record[key] === query[key])
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

    if (recordKey) {
      keys.forEach(key => record[key] = requestedChange[key])

      localStorage.recordKey = record
    }
    else {
      throw new ReferenceError('record does not exist')
    }
  }

  destroy(key) {
    localStorage.removeItem(key)
  }
}

module.exports = LocalRecord
