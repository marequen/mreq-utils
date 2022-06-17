import * as Utils from ".";

it('stringTrimFileExtension simple', ()=>{
  const result = Utils.stringTrimFileExtension('abc.ext');
  expect(result).toBe('abc');
})

it('stringTrimFileExtension with path', ()=>{
  const result = Utils.stringTrimFileExtension('path/abc.ext');
  expect(result).toBe('path/abc');
})

it('stringTrimFileExtension with unicode', ()=>{
  const result = Utils.stringTrimFileExtension('path/สวัสดี.ext');
  expect(result).toBe('path/สวัสดี');
})

it('stringTrimFileExtension with unicode ext', ()=>{
  const result = Utils.stringTrimFileExtension('path/สวัสดี.ครับ');
  expect(result).toBe('path/สวัสดี');
})

it('stringTrimFileExtension with 2 dots', ()=>{
  const result = Utils.stringTrimFileExtension('abc..ext');
  expect(result).toBe('abc.');
})

it('arrayLast', ()=>{
  const result = Utils.arrayLast([1,2,3]);
  expect(result).toBe(3);
})
it('arrayLast empty array', ()=>{
  const result = Utils.arrayLast([]);
  expect(result).toBeUndefined();
})

it('arrayRemoveIndex', ()=>{
  let testArray = [1,2,3];
  const result = Utils.arrayRemoveIndex(testArray, 1);

  expect(testArray).toEqual([1,3]);
  expect(result).toEqual([2]);
})

it('mapSome', ()=>{
  let testMap = new Map();
  testMap.set('a', 'first');
  testMap.set('b', 'last');
  const result = Utils.mapSome(testMap, v => v === 'last');
  expect(result).toBe(true);
})

it('mapFilterInPlace', ()=>{
  let testMap = new Map();
  testMap.set('a', 'first');
  testMap.set('b', 'last');
  Utils.mapFilterInPlace(testMap, v => v !== 'last');
  expect(testMap.get('a')).toBe('first');
  expect(testMap.get('b')).toBeUndefined();
})

it('setsMerge', ()=>{
  let testSetA = new Set();
  testSetA.add('a');

  let testSetB = new Set();
  testSetB.add('b');

  let result = Utils.setsMerge([testSetA, testSetB]);
  expect(result.has('a')).toBe(true);
  expect(result.has('b')).toBe(true);
})

it('setMergeInPlace', ()=>{
  let testSetA = new Set();
  testSetA.add('a');

  let testSetB = new Set();
  testSetB.add('b');

  Utils.setMergeInPlace(testSetA, testSetB);
  expect(testSetA.has('a')).toBe(true);
  expect(testSetA.has('b')).toBe(true);
})

it('domClosest', ()=>{
  let top    = { theOne: true}
  let middle = { theOne: false, parentElement: top};
  let bottom = { theOne: false, parentElement: middle};

  let result = Utils.domClosest(bottom, e => e.theOne);
  expect(result).toBe(top);

  result = Utils.domIsDescendant(top, bottom);
  expect(result).toBe(true);

  result = Utils.domIsDescendant(top, middle);
  expect(result).toBe(true);

  result = Utils.domIsDescendant(top, top);
  expect(result).toBe(true);

  result = Utils.domIsDescendant(bottom, top);
  expect(result).toBe(false);
})

it ('isFunction', ()=>{

  function testFunc1(){}
  const testFunc2 = ()=>{}

  expect(Utils.isFunction(testFunc1)).toBe(true);
  expect(Utils.isFunction(testFunc2)).toBe(true);
  expect(Utils.isFunction('string')).toBe(false);
  expect(Utils.isFunction(42)).toBe(false);
})

it('formatMailToLink', ()=>{

  let result = Utils.formatMailToLink('henry@ford.com');
  expect(result).toMatch(/<a /);
  expect(result).toMatch(/ href=['"]mailto:henry@ford.com/);
  expect(result).toMatch(/>.*henry@ford\.com.*<\/a>/)

})

it('objectToQueryString with scalars', ()=>{
  const testObject = {
    'v0':1, 'v1':'hi', 'v2':'&'
  };
  const result = Utils.objectToQueryString(testObject);
  expect(result ).toBe('v0=1&v1=hi&v2=%26');
})

it('objectToQueryString with array', ()=>{
  const testObject = {
    'v0': [1,2,3], 'v1':'hi'
  };
  const result = Utils.objectToQueryString(testObject);
  expect(result).toBe('v0=1&v0=2&v0=3&v1=hi');
})

it('pathProp 1 level', ()=>{
  const testObject = {
    foo: 69
  };
  const result = Utils.pathProp(testObject, 'foo');
  expect(result).toBe(69);
})

it('pathProp 2 levels', ()=>{
  const testObject = {
    foo: {
      bar: 69
    }
  };
  const result = Utils.pathProp(testObject, 'foo.bar');
  expect(result).toBe(69);
})


it('pathProp 2 levels, undefined', ()=>{
  const testObject = {
    foo: {
      bar: 69
    }
  };
  const result = Utils.pathProp(testObject, 'lang.th.foo.bar');
  expect(result).toBeUndefined();
})

it('pathProp 3 levels', ()=>{
  const testObject = {
    foo: {
      bar: {
        snafu: 69
      }
    }
  };
  const result = Utils.pathProp(testObject, 'foo.bar.snafu');
  expect(result).toBe(69);
})

it('pathProp array 1 level', ()=>{
  const testObject = {
    foo: [69]
  };
  const result = Utils.pathProp(testObject, 'foo[0]');
  expect(result).toBe(69);
})
it('pathProp array 2 level', ()=>{
  const testObject = {
    foo: {
      bar: [19, 69]
    }
  };
  const result = Utils.pathProp(testObject, 'foo.bar[1]');
  expect(result).toBe(69);
})
it('pathProp foo[0].bar', ()=>{
  const testObject = {
    foo: [
      { bar: 69 }
    ]
  };
  const result = Utils.pathProp(testObject, 'foo[0].bar');
  expect(result).toBe(69);
})
it('pathPropStore foo.bar', ()=>{
  const testObject = {
    foo: {
      bar: 68
    }
  };
  Utils.pathPropStore(testObject, 'foo.bar',  69);
  expect(testObject.foo.bar).toBe(69);
})

it('pathPropStore undefined target', ()=>{
  const testObject = {
    foo: {
      bar: 68
    }
  };
  Utils.pathPropStore(testObject, 'lang.th.foo.bar',  69);
  expect(testObject.lang.th.foo.bar).toBe(69);
})

it('pathPropStore foo[0]', ()=>{
  const testObject = {
    foo: [
      { bar: 68 }
    ]
  };
  Utils.pathPropStore(testObject, 'foo[0]', {bar: 69});
  expect(testObject.foo[0].bar).toBe(69);
})
it('pathPropStore foo[0].bar', ()=>{
  const testObject = {
    foo: [
      { bar: 68 }
    ]
  };
  Utils.pathPropStore(testObject, 'foo[0].bar', 69);
  expect(testObject.foo[0].bar).toBe(69);
})

it('propsDiff', ()=>{

  let testObjA = { a: 1, b: 2}
  let testObjB = { a: 1, b: 3}
  let result = Utils.propsDiff(testObjA, testObjB);
  expect(result).toEqual(['b']);

})

it('jsonParseNoThrow valid JSON', ()=>{

  let result = Utils.jsonParseNoThrow('{ "a": 1942 }');
  expect(result).toEqual({ "a": 1942} );
})

it('jsonParseNoThrow invalid JSON', ()=>{

  let result = Utils.jsonParseNoThrow('{ "a: 1942 }');
  expect(result).toEqual(null );

})

it('jsonReplacer', ()=>{

  let setA = new Set();
  setA.add('foo');

  let testObj = { 'set': setA };
  let result = Utils.jsonReplacer('set', testObj['set']);
  expect(Array.isArray(result)).toBe(true);
  expect(result).toEqual(['foo'])
})

it('arrayOrUndefinedToSet', ()=>{

  let result;
  Utils.arrayOrUndefinedToSet(undefined, s => result = s);
  expect(result).toEqual(new Set());

  Utils.arrayOrUndefinedToSet(['foo'], s => result = s);
  expect(result.has('foo')).toEqual(true);
})

const oneDay = 60*60*24*1000;
it('timeStampToDateInputValue', ()=>{
  let result = Utils.timeStampToDateInputValue(0);
  expect(result).toBe('1970-01-01');

  result = Utils.timeStampToDateInputValue(oneDay - 1);
  expect(result).toBe('1970-01-01');

  result = Utils.timeStampToDateInputValue(oneDay);
  expect(result).toBe('1970-01-02');
})

it('dateInputValueToTimeStamp', ()=>{
  let result = Utils.dateInputValueToTimeStamp('1970-01-01');
  expect(result).toBe(0);

  result = Utils.dateInputValueToTimeStamp('1970-01-02');
  expect(result).toBe(oneDay);
})

it('promiseAllSettledTallyResults', ()=>{
  const promise1 = Promise.resolve(3);
  const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
  const promise3 = Promise.reject();

  const promises = [promise1, promise2, promise3];

  Promise.allSettled(promises).
  then((results) => {
    let result = Utils.promiseAllSettledTallyResults(results);
    expect(result).toBe([1,2]);
  });
})

it('caseUnexpected', ()=>{
  let caught = false;
  try {
    Utils.caseUnexpected(42)
  } catch (err){
    caught = true
  }
  expect(caught).toEqual(true)
})

it('ignorePromise', ()=>{
  const promise = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
  promise.then(Utils.ignorePromise);
  // Nothing to test, but the line above should not show a 'promise ignored' warning
})