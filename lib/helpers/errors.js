module.exports = {
  recordAlreadyExists() {
    return new ReferenceError('record already exists')
  },

  noExistingRecord() {
    return new ReferenceError('record does not exist')
  },

  invalidParams(params) {
    return new TypeError(`expected Object, but got ${params.constructor.name} instead`)
  }
}
