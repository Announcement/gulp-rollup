'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var exists = function (it) {
  return it !== undefined && it !== null
};

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

exports.string = string;
exports.array = array;

//# sourceMappingURL=valid.js.map
