var exists = require('./exists')

exports.array = function array (it) {
  return exists(it) && valid(it)

  function valid (it) {
    return it instanceof Array && it.length > 0
  }
}

exports.string = function string (it) {
  return exists(it) && valid(it)

  function valid (it) {
    return it.length > 0
  }
}
