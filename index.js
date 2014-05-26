
var patrun  = require('patrun')

function Planner() {
  if (!(this instanceof Planner)) {
    return new Planner()
  }

  this._tasks = patrun()
}

Planner.prototype.addTask = function(pattern, task) {
  this._tasks.add(pattern, task)

  return this
}

// TODO this needs to be recursive
function isInside(a, b) {
  for (var k in a) {
    if (a[k] !== b[k]) {
      return false
    }
  }

  return true
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
    , op = this._tasks.find(task, true)

  if (!op) {
    return null
  }

  if (!isInside(op.preconditions, state)) {
    return null
  }

  newState = Object.keys(op.effects || {}).reduce(function(newState, key) {
    newState[key] = op.effects[key]
    return newState
  }, Object.create(state));

  if (op.subTasks) {
    toExecute = toExecute.concat(op.subTasks)
  } else {
    tasks.push(task)
  }

  return this.plan(newState, toExecute, tasks)
}

module.exports = Planner
