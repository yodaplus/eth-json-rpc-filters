const SafeEventEmitter = require('safe-event-emitter')
const deepEqual = require('fast-deep-equal')

class BaseFilter extends SafeEventEmitter {

  constructor () {
    super()
    this.updates = []
    this.allResults = []
  }

  async initialize () {}

  async update () {
    throw new Error('BaseFilter - no update method specified')
  }

  addResults (newResults) {
    const newResultsFiltered = newResults.filter((newResult) => {
      const emittedBefore = this.allResults.some((emiitedResult) => {
        return deepEqual(emiitedResult, newResult)
      })

      return !emittedBefore
    })
    this.updates = this.updates.concat(newResultsFiltered)
    this.allResults = this.allResults.concat(newResultsFiltered)
    newResultsFiltered.forEach(result => this.emit('update', result))
  }

  addInitialResults (newResults) {
    this.allResults = this.allResults.concat(newResults)
  }

  getChangesAndClear () {
    const updates = this.updates
    this.updates = []
    return updates
  }

  getAllResults () {
    return this.allResults
  }

}

module.exports = BaseFilter
