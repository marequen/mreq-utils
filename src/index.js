const bracketRe = /(.+)\[([0-9]+)]/;

// segment can be a simple property name, such as "name" or
// a name with an array index, such as "foo[0]"
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

export function stringTrimFileExtension(s){
  return s.replace(/\.[^/.]+$/, '');
}

export function arrayLast(a){
  console.assert(Array.isArray(a));
  return a[a.length - 1];
}

export function arrayRemoveIndex(a, i){
  return a.splice(i, 1);
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

export function objectToQueryString(obj) {
  let params = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      const val = obj[p];
      if (Array.isArray(val)){
        params.push(arrayToQueryParams(val, p));
      } else {
        params.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  return params.join("&");
}

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
 * @param object
 * @param path
 * @return {undefined}
 */
export function pathProp(object, path){

  let result = undefined;

  let pathSegments = path.split('.');
  for (let pathSegment of pathSegments){
    if (pathSegment.length === 0) throw (new Error("empty path segment"));
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
 * @param object
 * @param path
 * @param value
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
 * @return {*[]}
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

export function jsonReplacer(key, value){
  if (value instanceof Set){
    return Array.from(value);
  }
  return value;
}

/** While jsonReplacer converts Sets to Arrays, for storing in JSON, this function
 * helps to do the opposite. There's no easy way to do it automagically, since we'd
 * have to know which Arrays are meant to be converted and which ones should be left
 * as Arrays. I THOUGHT about adding meta-data to the output of jsonReplacer, but that
 * felt a bit lame. */
export function arrayOrUndefinedToSet(val, callback){
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