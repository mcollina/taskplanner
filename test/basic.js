
var test = require('tap').test
  , planner = require('../')

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

test('multiple tasks', function(t) {

  var instance = planner()
    , plan
    , expected = [{
          cmd: 'get car'
      }, {
          cmd: 'drive'
        , to: 'supermarket'
      }]

  instance.addTask({ cmd: 'go', to: 'supermarket' }, {
      preconditions: { state: 'in the car' }
    , subTasks: [ { cmd: 'drive', to: 'supermarket' } ]
  })

  instance.addTask({ cmd: 'go', to: 'supermarket' }, {
      preconditions: { state: 'at home' }
    , subTasks: [ { cmd: 'get car' }, { cmd: 'go', to: 'supermarket' } ]
  })

  instance.addTask({ cmd: 'get car' }, {
      preconditions: { state: 'at home' }
    , effects: { state: 'in the car' }
  })

  instance.addTask({ cmd: 'drive', to: 'supermarket' }, {
      preconditions: { state: 'in the car' }
    , effects: { state: 'in the supermarket' }
  })

  plan = instance.plan({ state: 'at home' }, { cmd: 'go', to: 'supermarket' })

  t.deepEqual(plan, expected)
  t.end()
})

test('deep state matching', function(t) {

  var instance = planner()
    , plan
    , expected = [{
          cmd: 'walk'
      }]

  instance.addTask({ cmd: 'walk' }, {
      preconditions: { state: { position: 'standing' } }
    , effects: { state: 'walking' }
  })

  plan = instance.plan({ state: { position: 'standing' } }, { cmd: 'walk' })

  t.deepEqual(plan, expected)
  t.end()
})

test('deep effects', function(t) {

  var instance = planner()
    , plan
    , expected = [{
          cmd: 'get car'
      }, {
          cmd: 'drive'
        , to: 'supermarket'
      }]

  instance.addTask({ cmd: 'go', to: 'supermarket' }, {
      preconditions: { state: { me: 'in the car', car: 'stopped' } }
    , subTasks: [ { cmd: 'drive', to: 'supermarket' } ]
  })

  instance.addTask({ cmd: 'go', to: 'supermarket' }, {
      preconditions: { state: { me: 'at home' } }
    , subTasks: [ { cmd: 'get car' }, { cmd: 'go', to: 'supermarket' } ]
  })

  instance.addTask({ cmd: 'get car' }, {
      preconditions: { state: { me: 'at home' } }
    , effects: { state: { me: 'in the car' } }
  })

  instance.addTask({ cmd: 'drive', to: 'supermarket' }, {
      preconditions: { state: { me: 'in the car' } }
    , effects: { state: { me: 'in the supermarket' } }
  })

  plan = instance.plan({ state: { me: 'at home', car: 'stopped' } }, { cmd: 'go', to: 'supermarket' })

  t.deepEqual(plan, expected)
  t.end()
})
