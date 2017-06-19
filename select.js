module.exports = function () {
  var parameters

  parameters = Array.prototype.slice.call(arguments, 0)

  return function (it) {
    var object

    object = {}

    parameters.forEach(forEach)

    return object

    function forEach (key) {
      object[key] = it[key]
    }
  }
}
