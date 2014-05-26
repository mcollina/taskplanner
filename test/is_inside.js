
var test     = require('tap').test
  , isInside = require('../lib/is_inside')

function insideTest(name, a, b) {
  test('inside test with ' + name, function(t) {
    t.plan(1)
    t.ok(isInside(a, b), 'inside')
  })
}

function notInsideTest(name, a, b) {
  test('not inside test with ' + name, function(t) {
    t.plan(1)
    t.notOk(isInside(a, b), 'not inside')
  })
}

insideTest('same objects', { a: 1 }, { a: 1 })
notInsideTest('different objects', { a: 1 }, { b: 1 })

insideTest('recursive objects', { a: { b: 1 } }, { a: { b: 1 } })
notInsideTest('nested different objects', { a: { b: 1 } }, { a: { c: 1 } })

insideTest('more properties on the right', { a: 1 }, { a: 1, c: 2 })
notInsideTest('more properties on the left', { a: 1, c: 2 }, { a: 1 })
