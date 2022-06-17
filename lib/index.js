"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayLast = arrayLast;
exports.arrayOrUndefinedToSet = arrayOrUndefinedToSet;
exports.arrayRemoveIndex = arrayRemoveIndex;
exports.arrayToQueryParams = arrayToQueryParams;
exports.caseUnexpected = caseUnexpected;
exports.dateInputValueToTimeStamp = dateInputValueToTimeStamp;
exports.domClosest = domClosest;
exports.domIsDescendant = domIsDescendant;
exports.formatMailToLink = formatMailToLink;
exports.ignorePromise = ignorePromise;
exports.isFunction = isFunction;
exports.jsonParseNoThrow = jsonParseNoThrow;
exports.jsonReplacer = jsonReplacer;
exports.mapFilterInPlace = mapFilterInPlace;
exports.mapSome = mapSome;
exports.objectToQueryString = objectToQueryString;
exports.pathProp = pathProp;
exports.pathPropStore = pathPropStore;
exports.promiseAllSettledTallyResults = promiseAllSettledTallyResults;
exports.propsDiff = propsDiff;
exports.setMergeInPlace = setMergeInPlace;
exports.setsMerge = setsMerge;
exports.stringTrimFileExtension = stringTrimFileExtension;
exports.timeStampToDateInputValue = timeStampToDateInputValue;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var bracketRe = /(.+)\[([0-9]+)]/; // segment can be a simple property name, such as "name" or
// a name with an array index, such as "foo[0]"

function segmentProp(object, segment) {
  var match = bracketRe.exec(segment);

  if (match) {
    var prop = match[1];
    var index = parseInt(match[2]);
    var maybeArray = object[prop];

    if (Array.isArray(maybeArray)) {
      return maybeArray[index];
    }

    return undefined;
  } else {
    return object[segment];
  }
}

function stringTrimFileExtension(s) {
  return s.replace(/\.[^/.]+$/, '');
}

function arrayLast(a) {
  console.assert(Array.isArray(a));
  return a[a.length - 1];
}

function arrayRemoveIndex(a, i) {
  return a.splice(i, 1);
}
/** Like Array.some, for Map */


function mapSome(map, predicate) {
  // eslint-disable-next-line
  var _iterator = _createForOfIteratorHelper(map),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          _k = _step$value[0],
          v = _step$value[1];

      if (predicate(v)) {
        return true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return false;
}
/** Like Array.filter, for Map, but unlike Array.filter, this filters in place */


function mapFilterInPlace(map, predicate) {
  var keysToDelete = [];

  var _iterator2 = _createForOfIteratorHelper(map),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _slicedToArray(_step2.value, 2),
          k = _step2$value[0],
          v = _step2$value[1];

      if (!predicate(v)) {
        keysToDelete.push(k);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  keysToDelete.forEach(function (key) {
    return map["delete"](key);
  });
}
/**
 * Merge a source Set into a destination Set
 * @param destination
 * @param source
 */


function setMergeInPlace(destination, source) {
  source.forEach(function (value) {
    destination.add(value);
  });
}
/**
 * Merge an array of Sets into a new Set
 * @param {[Set<any>]} sets
 * @return {Set<any>}
 */


function setsMerge(sets) {
  var result = new Set();

  var _iterator3 = _createForOfIteratorHelper(sets),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var set = _step3.value;
      setMergeInPlace(result, set);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return result;
}
/** Similar to jQuery.closest.  */


function domClosest(e, predicate) {
  var cur = e;

  while (cur) {
    if (predicate(cur)) {
      return cur;
    }

    cur = cur.parentElement;
  }

  return null;
}

function domIsDescendant(ancestor, potentialDescendant) {
  return domClosest(potentialDescendant, function (ee) {
    return ee === ancestor;
  }) !== null;
}

function isFunction(foo) {
  return !!foo && {}.toString.call(foo) === '[object Function]';
}

function formatMailToLink(emailAddress) {
  return "<a href=\"mailto:".concat(emailAddress, "\">").concat(emailAddress, "</a>");
}

function objectToQueryString(obj) {
  var params = [];

  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var val = obj[p];

      if (Array.isArray(val)) {
        params.push(arrayToQueryParams(val, p));
      } else {
        params.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  }

  return params.join("&");
}

function arrayToQueryParams(array, paramName) {
  var str = paramName + '=';

  for (var i = 0; i < array.length; ++i) {
    if (i > 0) {
      str += "&".concat(paramName, "=");
    }

    str += encodeURIComponent(array[i]);
  }

  return str;
}
/**
 * Given an object and a dot-style property name specification,
 * return the value of the property at that path.
 * @param object
 * @param path
 * @return {undefined}
 */


function pathProp(object, path) {
  var result = undefined;
  var pathSegments = path.split('.');

  var _iterator4 = _createForOfIteratorHelper(pathSegments),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var pathSegment = _step4.value;
      if (pathSegment.length === 0) throw new Error("empty path segment");

      if (result === undefined) {
        // first time through
        result = segmentProp(object, pathSegment);
      } else {
        result = segmentProp(result, pathSegment);
      }

      if (result === undefined) break; // no data at segment
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return result;
}
/**
 * Given an object, a value, and a dot-style property name specification,
 * set the value of the object's property
 * @param object
 * @param path
 * @param value
 */


function pathPropStore(object, path, value) {
  if (!path) throw new Error('empty path');
  var pathSegments = path.split('.');
  var lastPathSegment;
  var cur = object;
  var penultimate;

  while (pathSegments.length) {
    var pathSegment = pathSegments.shift();
    if (pathSegment.length === 0) throw new Error("empty path segment");
    var match = bracketRe.exec(pathSegment);

    if (match) {
      // This segment is an array[index] accessor
      var prop = match[1];
      var index = parseInt(match[2]);
      penultimate = cur[prop];

      if (penultimate === undefined && index === 0) {
        // Allow setting first array item, even if the array doesn't yet exist.
        // Useful for setting includedPhotos[0]
        cur[prop] = [];
        penultimate = cur[prop];
      }

      cur = penultimate[index];
      lastPathSegment = index;
    } else {
      // This is a simple property name accessor
      if (cur[pathSegment] === undefined) {
        // Recursively build out segments in which to store 'value'
        // This is mainly used to populate translation fields.
        cur[pathSegment] = {};
      }

      penultimate = cur;
      cur = cur[pathSegment];
      lastPathSegment = pathSegment;
    }
  }

  penultimate[lastPathSegment] = value;
}
/**
 * Given two objects, compare their property-value pairs and return a list of
 * property keys whose values aren't strictly equal.
 * NOTE: does not recurse!
 * @param a
 * @param b
 * @return {*[]}
 */


function propsDiff(a, b) {
  var diffs = [];

  if (a !== b) {
    if (!!a) {
      for (var _i2 = 0, _Object$entries = Object.entries(a); _i2 < _Object$entries.length; _i2++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            k = _Object$entries$_i[0],
            v = _Object$entries$_i[1];

        if (!b || v !== b[k]) {
          diffs.push(k);
        }
      }
    }

    if (!!b) {
      for (var _i3 = 0, _Object$keys = Object.keys(b); _i3 < _Object$keys.length; _i3++) {
        var _k2 = _Object$keys[_i3];

        if (!a || a[_k2] === undefined) {
          diffs.push(_k2);
        }
      }
    }
  }

  return diffs;
}
/**
 *
 * @param {string} s
 * @return {null|any}
 */


function jsonParseNoThrow(s) {
  try {
    var result = JSON.parse(s);
    return result;
  } catch (err) {
    console.error('parsing JSON', err);
    return null;
  }
}

function jsonReplacer(key, value) {
  if (value instanceof Set) {
    return Array.from(value);
  }

  return value;
}
/** While jsonReplacer converts Sets to Arrays, for storing in JSON, this function
 * helps to do the opposite. There's no easy way to do it automagically, since we'd
 * have to know which Arrays are meant to be converted and which ones should be left
 * as Arrays. I THOUGHT about adding meta-data to the output of jsonReplacer, but that
 * felt a bit lame. */


function arrayOrUndefinedToSet(val, callback) {
  if (val === undefined) {
    callback(new Set());
  } else if (Array.isArray(val)) {
    callback(new Set(val));
  }
}
/**
 * HTMLInputElement of type 'date' takes and returns a date value
 * in YYYY-MM-DD format. This function converts it to a UNIX timestamp,
 * which may be preferable for storage.
 * @param {string} yyyymmdd in format YYYY-MM-DD
 * @return {number}
 */


function dateInputValueToTimeStamp(yyyymmdd) {
  var date = new Date(yyyymmdd);
  return date.getTime();
}
/**
 * This does the opposite of dateInputValueToTimeStamp. See above.
 * @param {number} ts
 * @return {string}
 */


function timeStampToDateInputValue(ts) {
  var date = new Date();
  date.setTime(ts);
  var yyyymmdd = date.toISOString().split('T')[0];
  return yyyymmdd;
}
/**
 * Tallies the 'fulfilled' outcomes from a previous call to Promise.allSettled,
 * returning an array of two numbers, corresponding to fulfilled and unfulfilled
 * (rejected) results.
 * @param resultsIterable
 * @return {Array}
 */


function promiseAllSettledTallyResults(resultsIterable) {
  var successAndFails = resultsIterable.reduce(function (prev, promiseResult) {
    if (promiseResult.status === 'fulfilled') {
      return [prev[0] + 1, prev[1]];
    } else {
      return [prev[0], prev[1] + 1];
    }
  }, [0, 0]);
  return successAndFails;
}
/**
 * Used in conjunction with a 'default' case, in a switch statement;
 * such as when all possible enum values have been handled, but the
 * IDE linter complains about not having a default handler.
 * @param v
 */


function caseUnexpected(v) {
  throw new Error('unexpected switch value: ' + v);
}
/**
 * Used to hush 'unhandled promise' linter warnings
 */


function ignorePromise() {}