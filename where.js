'use strict'
//
// github.com/Announcement/helpers precompiled for your convenience.
//
Object.defineProperty(exports, '__esModule', { value: true })

var combine = function combine (array, values) {
  var index = void 0

  array = array.concat([])

  while ((index = array.indexOf(undefined)) !== -1 && values.length > 0) {
    array[index] = values.shift()
  }

  return array.concat(values)
}

var $array = function $array (it) {
  return Array.prototype.slice.call(it, 0)
}

var empty = function empty (it) {
  return it === undefined || it === null
}

var curry = function curry (method) {
  var enough = function enough (input) {
    return input.length >= method.length
  }
  var missing = function missing (input) {
    return input.some(empty)
  }
  var ready = function ready (it) {
    return enough(it) && !missing(it)
  }

  return method.length <= 1 ? method : transform([])

  function transform (parameters) {
    var inputs
    var context

    var results = function results () {
      return method.apply(context, inputs)
    }
    var update = function update (it) {
      return context || it
    }
    var fetch = function fetch (it) {
      return !ready(it) ? transform(it) : results()
    }

    return callback

    function callback () {
      for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
        input[_key] = arguments[_key]
      }

      var response

      inputs = combine(parameters, $array(arguments))
      context = update(this)
      response = fetch(inputs)

      return response
    }
  }
}

function where (search, object) {
  var keys
  var result

  var every = function every (key) {
    return search[key] === object[key]
  }

  keys = Object.keys(search)
  result = keys.every(every)

  return result
}

exports.where = curry(where)

function flatten () {
  var array = $array(arguments)
  var isArray = void 0
  var toArray = void 0
  var fromArray = void 0

  isArray = function isArray (it) {
    return it.constructor === Array
  }
  toArray = function toArray (it) {
    return isArray(it) ? it : [it]
  }
  fromArray = function fromArray (a, b) {
    return a.concat(b)
  }

  while (array.some(isArray)) {
    array = array.map(toArray).reduce(fromArray)
  }

  return array
}

function select (it) {
  var params = flatten(it, $array(arguments))
  var isArray = function isArray (it) {
    return it instanceof Array
  }

  function compliant (it, key) {
    return params.indexOf(key) !== -1 ? it[key] : [it[key]]
  }

  function prepare (it) {
    var key

    for (key in it) {
      it[key] = compliant(it, key)
    }

    return it
  }

  function normalize (it) {
    if (!isArray(it)) {
      return [prepare(it)]
    }

    return it
  }

  function pull (item) {
    var response

    var forEach = function forEach (param) {
      response[param] = item[param]
    }

    response = {}

    params.forEach(forEach)

    return response
  }

  function merge (reference, object) {
    var keys

    var ensure = function ensure (key) {
      reference[key] = reference[key] || []
    }
    var concat = function concat (key) {
      reference[key] = reference[key].concat(object[key])
    }
    var listed = function listed (key) {
      return params.indexOf(key) === -1
    }

    keys = Object.keys(object).filter(listed)

    keys.forEach(ensure)
    keys.forEach(concat)

    return reference
  }

  function append (array, item) {
    var index
    var query
    var search

    query = pull(item)
    search = exports.where(query)
    index = array.findIndex(search)

    if (index !== -1) {
      array[index] = merge(array[index], item)
    } else {
      array.push(item)
    }

    return array
  }

  function reducer (previous, current) {
    var array
    var item

    array = normalize(previous)
    item = prepare(current)

    array = append(array, item)

    return array
  }

  return reducer
}

var unique = {
  normal: curry(function normal (array, value) {
    return array.filter(exports.where(value)).length > 1
  }),
  filter: function filter (value, index, array) {
    return array.indexOf(value, index + 1) === -1
  },
  reduce: function reduce (previous, current) {
    var beforeReduce = function beforeReduce (it) {
      return it instanceof Array ? it : [it]
    }

    previous = beforeReduce(previous)

    if (!previous.find(exports.where(current))) {
      previous.push(current)
    }

    return previous
  }
}

exports.select = select
exports.unique = unique

//# sourceMappingURL=map/query.js.map
