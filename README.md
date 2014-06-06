taskplanner
===========

Plan any task into subtasks!

```js
var planner   = require('taskplanner')()
  , assert    = require('assert')
  , expected  = [{
        cmd: 'get car'
    }, {
        cmd: 'drive'
      , to: 'supermarket'
    }]
  , plan

plan = planner.addTask({ cmd: 'go', to: 'supermarket' }, {
    preconditions: { state: 'in the car' }
  , subTasks: [ { cmd: 'drive', to: 'supermarket' } ]
}).addTask({ cmd: 'go', to: 'supermarket' }, {
    preconditions: { state: 'at home' }
  , subTasks: [ { cmd: 'get car' }, { cmd: 'go', to: 'supermarket' } ]
}).addTask({ cmd: 'get car' }, {
    preconditions: { state: 'at home' }
  , effects: { state: 'in the car' }
}).addTask({ cmd: 'drive', to: 'supermarket' }, {
    preconditions: { state: 'in the car' }
  , effects: { state: 'in the supermarket' }
}).plan({ state: 'at home' }, { cmd: 'go', to: 'supermarket' })

assert.deepEqual(plan, expected)
```

Acknowledgements
----------------

This project was kindly sponsored by [nearForm](http://nearform.com).

License
-------

MIT
