import exists from './exists'

function array (it) {
  return exists(it) && valid(it)

  function valid (it) {
    return it instanceof Array && it.length > 0
  }
}

function string (it) {
  return exists(it) && valid(it)

  function valid (it) {
    return it instanceof String && it.length > 0
  }
}

export { string, array }
