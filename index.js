
var patrun    = require('patrun')
  , isInside  = require('./lib/is_inside')
  , _         = require('lodash')

function Planner() {
  if (!(this instanceof Planner)) {
    return new Planner()
  }

  this._tasks = patrun()
}

Planner.prototype.addTask = function(pattern, task) {

  var tasks = this._tasks.find(pattern, true)

  if (tasks) {
    tasks.push(task)
  } else {
    this._tasks.add(pattern, [task])
  }

  return this
}

Planner.prototype.plan = function(state, toExecute, tasks) {
  if (!tasks) {
    tasks = []
  }

  if (!Array.isArray(toExecute)) {
    return this.plan(state, [toExecute], tasks)
  }

  if (toExecute.length === 0) {
    return tasks
  }

  var task = toExecute.shift()
    , ops = this._tasks.find(task, true)
    , that = this

  if (!ops || ops.length == 0) {
    return null
  }

  return ops.reduce(function(result, op) {
    if (result)
      return result

    var newState

    if (!isInside(op.preconditions, state))
      return null

    newState = _.merge(state, op.effects)

    if (op.subTasks) {
      toExecute = op.subTasks.concat(toExecute)
    } else {
      tasks.push(task)
    }

    return that.plan(newState, toExecute, tasks)
  }, null)
}

module.exports = Planner
