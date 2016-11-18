class ArgumentError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ArgumentError'
    this.message = message

    Error.captureStackTrace(this, this.constructor)
  }
}

class UnknownPropertyError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnknownPropertyError'
    this.message = message

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  recordAlreadyExists() {
    return new ReferenceError('record already exists')
  },

  noExistingRecord() {
    return new ReferenceError('record does not exist')
  },

  invalidParams(params) {
    return new ArgumentError(`expected Object, but got ${params.constructor.name} instead`)
  },

  unknownProperty(prop) {
    return new UnknownPropertyError(`unknown property '${prop}' for record`)
  }
}
