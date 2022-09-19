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
 * For a given property of an object,
 * if the property is undefined, initialize it with the given default value,
 * then get the current value.
 * If defaultValue is non-trivial, consider using objectEnsurePropertyWithFactory,
 * which would only instantiate the default value when necessary.
 * @param {object} obj
 * @param {string|number|boolean} property
 * @param {*} defaultValue
 * @returns {*}
 */
export function objectEnsureProperty(obj, property, defaultValue){
  return objectEnsurePropertyWithFactory(obj, property, ()=>defaultValue);
}

/**
 * For a given property of an object,
 * if the property is undefined, initialize it with given default value factory function,
 * then get the current value.
 * @param {object} obj
 * @param {string|number|boolean} property
 * @param {()=>any} defaultValueFactory
 * @returns {*}
 */
export function objectEnsurePropertyWithFactory(obj, property, defaultValueFactory){
  let result = obj[property];
  if (result === undefined){
    result = obj[property] = defaultValueFactory()
  }
  return result;
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
