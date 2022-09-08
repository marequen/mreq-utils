const bracketRe = /(.+)\[([0-9]+)]/;


/**
 * Helper function for pathProp. 'Segment' can be a simple property
 * name, such as "name" or a name with an array index, such as "foo[0]"
 * @param {object} object
 * @param {string} segment
 * @returns {undefined|*}
 */
function segmentProp(object, segment){
  let match = bracketRe.exec(segment);
  if (match){
    let prop = match[1];
    let index = parseInt(match[2])
    let maybeArray = object[prop];
    if (Array.isArray(maybeArray)){
      return maybeArray[index];
    }
    return undefined;
  } else {
    return object[segment]
  }
}

/**
 * Helper function for sortedArrayFindFirstAndLast.
 * @param {Array<string>} list
 * @param {string} prefix
 * @param {number} low
 * @param {number} high
 * @param {function} valueGetter
 * @return {number}
 */
const sortedArrayFindLast = (list, prefix, low, high, valueGetter) => {

  let highestMatch = low;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const guess = valueGetter(list[mid]);

    if (guess.startsWith(prefix)) { //+++ TODO: do this case-insensitively
      if (mid === high){
        return mid;
      }
      highestMatch = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
      if (high === highestMatch){
        return highestMatch
      }
    }
  }
  // We assume that 'list[low-1]' is a match for 'prefix'; i.e., that sortedArrayFindLast
  // is only called after successfully finding a match in 'list'
  console.assert(valueGetter(list[low - 1]).startsWith(prefix));
  return low - 1;
}

function valOf(item){
  return item;
}

/**
 * Simple test for undefined or null
 * @param {*} x
 * @returns {boolean}
 */
export function notNil(x){
  return x !== undefined && x !== null;
}

/**
 * Case-insensitive string compare, ignoring diacritics
 * @param {string} s1
 * @param {string} s2
 * @returns {number}
 */
export function stringCompareLoose(s1, s2){
  return s1.localeCompare(s2, undefined, {sensitivity: 'base'});
}

/**
 * Case-insensitive string equality, ignoring diacritics
 * @param {string} s1
 * @param {string} s2
 * @returns {boolean}
 */
export function stringEqualLoose(s1, s2){
  return s1.localeCompare(s2, undefined, {sensitivity: 'base'}) === 0;
}

/**
 * Test that parameter is a non-empty string
 * @param {*} s
 * @returns {boolean}
 */
export function isNonEmptyString(s){
  return typeof s === 'string' && s.length > 0;
}

/**
 * Trims file extension, including period, from a string and returns it.
 * @param {string} s
 * @returns {string}
 */
export function stringTrimFileExtension(s){
  return s.replace(/\.[^/.]+$/, '');
}

/**
 * Returns first element of an array.
 * Mostly exists for symmetry with arrayLast.
 * @param {Array} a
 * @returns {* | undefined}
 */
export function arrayFirst(a){
  console.assert(Array.isArray(a));
  return a[0];
}

/**
 * Returns last element of an array.
 * @param {Array} a
 * @returns {* | undefined}
 */
export function arrayLast(a){
  console.assert(Array.isArray(a));
  return a[a.length - 1];
}

/**
 * Get the indexes of the first and last entries in a sorted string array
 * that start with the given prefix. Undefined behavior if the array is not
 * sorted.
 * @param {Array<string>} list
 * @param {string} prefix
 * @returns {[number,number]}
 */
export function sortedStringArrayFindFirstAndLast(list, prefix) {
  return sortedArrayFindFirstAndLast(list, prefix, valOf)
}

/**
 * Get the indexes of the first and last entries in a sorted array,
 * that start with the given prefix. Undefined behavior if the array is not
 * sorted.
 * @param {Array<any>} list
 * @param {string} prefix
 * @param {function} valueGetter - function to get the value-for-comparison of an element in the list
 * @return {[number, number]}
 */
export function sortedArrayFindFirstAndLast(list, prefix, valueGetter) {
  let low = 0;
  let high = list.length - 1;

  let prevMatch = -1;
  let lastItemLow = -1;
  let lastItemHigh;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const guess = valueGetter(list[mid])

    if (guess.startsWith(prefix)) { //+++ TODO: do this case-insensitively
      prevMatch = mid;
      if (lastItemLow === -1){
        lastItemLow = mid;
        lastItemHigh = high;
      }
      if (mid === low){
        // We found the first match, now find the highest
        const lastMatch = sortedArrayFindLast(list, prefix, lastItemLow + 1, lastItemHigh, valueGetter);
        return [mid, lastMatch];
      } else {
        high = mid - 1
      }
    } else if (prevMatch !== -1){
      low = mid + 1;
      if (low === prevMatch){
        // We found the first match, now find the highest
        const lastMatch = sortedArrayFindLast(list, prefix, lastItemLow + 1, lastItemHigh, valueGetter);
        return [prevMatch, lastMatch];
      }
    } else if (guess.localeCompare(prefix) < 0) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return [-1,-1] //if not found
}

/** Like Array.some, for Map */
export function mapSome(map, predicate){
  // eslint-disable-next-line
  for (const [_k, v] of map){
    if (predicate(v)){
      return true;
    }
  }
  return false;
}

/** Like Array.filter, for Map, but unlike Array.filter, this filters in place */
export function mapFilterInPlace(map, predicate){
  let keysToDelete = []
  for (const [k, v] of map){
    if (!predicate(v)){
      keysToDelete.push(k)
    }
  }
  keysToDelete.forEach(key => map.delete(key));
}

export function setFirst(s){
  const iterator1 = s[Symbol.iterator]();
  return iterator1.next().value
}

function setFindIterator(s, predicate){
  const iterator = s[Symbol.iterator]();
  for (;;){
    const iV = iterator.next();
    if (iV.done){
      return iV;
    }
    if (predicate(iV.value)){
      return iV;
    }
  }
}

export function setFind(s, predicate){
  const i = setFindIterator(s, predicate);
  return (i.done) ? undefined : i.value;
}

export function setToggle(s, value){
  s.has(value) ? s.delete(value) : s.add(value);
}

/**
 * Like Array.some, but for Set.
 * @param {Set} set
 * @param {function} predicate
 * @return {boolean}
 */
export function setSome(set, predicate){
  const i = setFindIterator(set, predicate);
  return !i.done
}

/**
 * Merge a source Set into a destination Set
 * @param destination
 * @param source
 */
export function setMergeInPlace(destination, source){
  source.forEach( value => {
    destination.add(value)
  })
}

/**
 * Merge an array of Sets into a new Set
 * @param {[Set<any>]} sets
 * @return {Set<any>}
 */
export function setsMerge(sets){
  let result = new Set();
  for (const set of sets){
    setMergeInPlace(result, set)
  }
  return result;
}

/** Similar to jQuery.closest.  */
export function domClosest(e, predicate){
  let cur = e;
  while (cur) {
    if (predicate(cur)) {
      return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}

export function domIsDescendant(ancestor, potentialDescendant){
  return domClosest(potentialDescendant, ee => ee === ancestor) !== null;
}

export function isFunction(foo){
  return !!foo && {}.toString.call(foo) === '[object Function]';
}

export function formatMailToLink(emailAddress){
  return `<a href="mailto:${emailAddress}">${emailAddress}</a>`;
}

/**
 *
 * @param {*} value
 * @returns {boolean}
 */
function isURIEncodable(value){
  return ['string', 'number', 'boolean'].includes(typeof(value));
}

/**
 *
 * @param {object} obj
 * @returns {string}
 */
export function objectToQueryString(obj) {
  let params = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      const val = obj[p];
      if (Array.isArray(val)){
        params.push(arrayToQueryParams(val, p));
      } else if (isURIEncodable(val)) {
        params.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
      } else {
        console.debug('cannot encode property', p, 'of', obj);
      }
    }
  return params.join("&");
}

/**
 *
 * @param {Array<string | number | boolean>} array
 * @param {string} paramName
 * @returns {string}
 */
export function arrayToQueryParams(array, paramName){
  let str = paramName + '=';
  for (let i = 0; i < array.length; ++i){
    if (i > 0){
      str += `&${paramName}=`
    }
    str += encodeURIComponent(array[i]);
  }
  return str;
}

/**
 * Given an object and a dot-style property name specification,
 * return the value of the property at that path.
 * @param {object} object
 * @param {string} path
 * @return {*}
 */
export function pathProp(object, path){

  if (isNonEmptyString(path) === false){
    throw new Error("invalid path");
  }

  let result = undefined;

  let pathSegments = path.split('.');
  for (let pathSegment of pathSegments){
    if (pathSegment.length === 0) {
      throw new Error("empty path segment");
    }
    if (result === undefined){
      // first time through
      result = segmentProp(object, pathSegment)
    } else {
      result = segmentProp(result, pathSegment)
    }
    if (result === undefined) break; // no data at segment
  }

  return result;
}

/**
 * Given an object, a value, and a dot-style property name specification,
 * set the value of the object's property
 * @param {object} object
 * @param {string} path
 * @param {*} value
 */
export function pathPropStore(object, path, value){
  if (!path) throw(new Error('empty path'));
  let pathSegments = path.split('.');

  let lastPathSegment;
  let cur = object;
  let penultimate;

  while (pathSegments.length){
    let pathSegment = pathSegments.shift();
    if (pathSegment.length === 0) throw (new Error("empty path segment"));

    let match = bracketRe.exec(pathSegment);
    if (match){
      // This segment is an array[index] accessor
      let prop = match[1];
      let index = parseInt(match[2])

      penultimate = cur[prop];
      if (penultimate === undefined && index === 0){
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
 * @return {Array<string>}
 */
export function propsDiff(a, b){

  let diffs = [];
  if (a !== b) {
    if (!!a) {
      for (const [k, v] of Object.entries(a)) {
        if (!b || v !== b[k]) {
          diffs.push(k);
        }
      }
    }
    if (!!b){
      for (const k of Object.keys(b)) {
        if (!a || a[k] === undefined) {
          diffs.push(k);
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
export function jsonParseNoThrow(s){
  try {
    let result = JSON.parse(s);
    return result;
  } catch(err){
    console.error('parsing JSON', err);
    return null;
  }
}

/**
 * HTMLInputElement of type 'date' takes and returns a date value
 * in YYYY-MM-DD format. This function converts it to a UNIX timestamp,
 * which may be preferable for storage.
 * @param {string} yyyymmdd in format YYYY-MM-DD
 * @return {number}
 */
export function dateInputValueToTimeStamp(yyyymmdd){
  let date = new Date(yyyymmdd);
  return date.getTime();
}

/**
 * This does the opposite of dateInputValueToTimeStamp. See above.
 * @param {number} ts
 * @return {string}
 */
export function timeStampToDateInputValue(ts){
  let date = new Date();
  date.setTime(ts);
  const yyyymmdd = date.toISOString().split('T')[0];
  return yyyymmdd;
}

/**
 * Tallies the 'fulfilled' outcomes from a previous call to Promise.allSettled,
 * returning an array of two numbers, corresponding to fulfilled and unfulfilled
 * (rejected) results.
 * @param resultsIterable
 * @return {Array}
 */
export function promiseAllSettledTallyResults( resultsIterable ){
  let successAndFails = resultsIterable.reduce( (prev, promiseResult) => {
    if (promiseResult.status === 'fulfilled'){
      return [prev[0] + 1, prev[1]];
    } else {
      return [prev[0], prev[1] + 1];
    }
  }, [0,0]);
  return successAndFails;
}

/**
 * Used in conjunction with a 'default' case, in a switch statement;
 * such as when all possible enum values have been handled, but the
 * IDE linter complains about not having a default handler.
 * @param v
 */
export function caseUnexpected(v){
  throw new Error('unexpected switch value: ' + v);
}

/**
 * Used to hush 'unhandled promise' linter warnings
 */
export function ignorePromise(){}

/**
 * Used to hush 'unhandled promise' linter warnings
 */
export function ignorePromiseResult(){}
