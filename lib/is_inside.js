
function isInside(a, b) {
  for (var k in a) {
    if (typeof a[k] === 'object') {
      if (!isInside(a[k], b[k])) {
        return false
      }
    } else if (a[k] !== b[k]) {
      return false
    }
  }

  return true
}

module.exports = isInside
