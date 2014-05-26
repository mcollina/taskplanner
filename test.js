
var test = require('tap').test
  , planner = require('./')

test('one-command planning', function(t) {

  var instance = planner()
    , plan
    , expected = [{
          cmd: 'walk'
      }]

  instance.addTask({ cmd: 'walk' }, {
      preconditions: { state: 'standing' }
    , effects: { state: 'walking' }
  })

  plan = instance.plan({ state: 'standing' }, { cmd: 'walk' })

  t.deepEqual(plan, expected)
  t.end()
})

test('two-command planning', function(t) {

  var instance = planner()
    , plan
    , expected = [{
          cmd: 'standup'
      }, {
          cmd: 'walk'
      }]

  instance.addTask({ cmd: 'go-out' }, {
      preconditions: { state: 'sitting' }
    , subTasks: [ { cmd: 'standup' }, { cmd: 'walk' } ]
  })

  instance.addTask({ cmd: 'standup' }, {
      preconditions: { state: 'sitting' }
    , effects: { state: 'standing' }
  })

  instance.addTask({ cmd: 'walk' }, {
      preconditions: { state: 'standing' }
    , effects: { state: 'walking' }
  })

  plan = instance.plan({ state: 'sitting' }, { cmd: 'go-out' })

  t.deepEqual(plan, expected)
  t.end()
})
