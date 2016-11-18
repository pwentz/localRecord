module.exports = {
  doAllPropsMatch(comparingRecord, record) {
    const keys = Object.keys(comparingRecord)

    const doesExistingEntryMatch = keys.every(key => {
      return comparingRecord[key] === record[key]
    })

    return doesExistingEntryMatch
  },

  findMatchingKey(record) {
    return Object.keys(localStorage).find(key => {
      const existingItem = JSON.parse(localStorage[key])

      // check all props of object to ensure referencing correct obj
      return this.doAllPropsMatch(existingItem, record)
    })
  },

  searchByParams(query, collection, command) {
    const match = collection[command](record => {
      return this.doAllPropsMatch(query, record)
    })

    if (match) return match
      return null
  }
}
