import * as Utils from "./index.js";
import {jest} from "@jest/globals";

afterEach(() => {
  jest.useRealTimers();
  window.location = {}
});

it('nonNil(undefined)', ()=>{
  expect(Utils.notNil(undefined)).toEqual(false);
})
it('nonNil(null)', ()=>{
  expect(Utils.notNil(null)).toEqual(false);
})
it('nonNil(false)', ()=>{
  expect(Utils.notNil(false)).toEqual(true);
})
it('nonNil(0)', ()=>{
  expect(Utils.notNil(0)).toEqual(true);
})
it('nonNil("")', ()=>{
  expect(Utils.notNil("")).toEqual(true);
})

it('stringCompareLoose("","")', ()=>{
  expect(Utils.stringCompareLoose("", "")).toEqual(0);
})
it('stringCompareLoose("a","A")', ()=>{
  expect(Utils.stringCompareLoose("a", "A")).toEqual(0);
})
it('stringCompareLoose("a","B")', ()=>{
  expect(Utils.stringCompareLoose("a", "B")).toEqual(-1);
})
it('stringCompareLoose("B","a")', ()=>{
  expect(Utils.stringCompareLoose("B", "a")).toEqual(1);
})

it('stringEqualLoose("","")', ()=>{
  expect(Utils.stringEqualLoose("", "")).toEqual(true);
})
it('stringEqualLoose("a","A")', ()=>{
  expect(Utils.stringEqualLoose("a", "A")).toEqual(true);
})
it('stringEqualLoose("a","B")', ()=>{
  expect(Utils.stringEqualLoose("a", "B")).toEqual(false);
})
it('stringEqualLoose("B","a")', ()=>{
  expect(Utils.stringEqualLoose("B", "a")).toEqual(false);
})
it('isNonEmptyString("")', ()=>{
  expect(Utils.isNonEmptyString("")).toEqual(false);
})
it('isNonEmptyString(...)', ()=>{
  let r = [null, undefined, false, true, 1, 0, {'a':1}, [1]].map(Utils.isNonEmptyString);
  let s = new Set(r);
  expect(s.size).toEqual(1);
  expect(s.has(true)).toEqual(false);
})
it('isNonEmptyString("a")', ()=>{
  expect(Utils.isNonEmptyString("a")).toEqual(true);
})

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

it('arrayFirst', ()=>{
  const result = Utils.arrayFirst([1,2,3]);
  expect(result).toBe(1);
})

it('arrayLast', ()=>{
  const result = Utils.arrayLast([1,2,3]);
  expect(result).toBe(3);
})
it('arrayLast empty array', ()=>{
  const result = Utils.arrayLast([]);
  expect(result).toBeUndefined();
})

it('sortedStringArrayFindFirstAndLast', ()=>{
  let a = [
    'a', 'b', 'ca', 'cb', 'cc', 'd'
  ];
  let [f,l] = Utils.sortedStringArrayFindFirstAndLast(a, 'c');
  expect(f).toBe(2);
  expect(l).toBe(4);
})

it('sortedStringArrayFindFirstAndLast 2', ()=>{
  let a = [
    'a', 'b', 'ca', 'cb', 'cc', 'd'
  ];
  let [f,l] = Utils.sortedStringArrayFindFirstAndLast(a, 'd');
  expect(f).toBe(5);
  expect(l).toBe(5);
})

it('sortedStringArrayFindFirstAndLast 3', ()=>{
  let a = [
    'a', 'b', 'ba', 'ca', 'cb', 'cc', 'd', 'e', 'f', 'g', 'h'
  ];
  let [f,l] = Utils.sortedStringArrayFindFirstAndLast(a, 'cb');
  expect(f).toBe(4);
  expect(l).toBe(4);
})

it('sortedStringArrayFindFirstAndLast 4', ()=>{
  let a = [
    'a', 'ab'
  ];
  let r = Utils.sortedStringArrayFindFirstAndLast(a, 'a');
  expect(r).toStrictEqual([0, 1]);
})

it('sortedStringArrayFindFirstAndLast not found', ()=>{
  let a = [
    'a', 'b', 'ca', 'cb', 'cc', 'd'
  ];
  let [f,l] = Utils.sortedStringArrayFindFirstAndLast(a, 'e');
  expect(f).toBe(-1);
  expect(l).toBe(-1);
})

it('sortedArrayFindFirstAndLast', ()=>{
  let a = [
    {name:'a'},
    {name:'b'},
    {name:'ca'},
    {name:'cb'},
    {name:'cc'},
    {name:'d'}
  ];
  let [f,l] = Utils.sortedArrayFindFirstAndLast(a, 'c', (item)=>item.name);
  expect(f).toBe(2);
  expect(l).toBe(4);
})

it('mapSome', ()=>{
  let testMap = new Map();
  testMap.set('a', 'first');
  testMap.set('b', 'last');
  let result = Utils.mapSome(testMap, v => v === 'last');
  expect(result).toBe(true);

  result = Utils.mapSome(testMap, v => v === 'not found');
  expect(result).toBe(false);
})

it('mapFilterInPlace', ()=>{
  let testMap = new Map();
  testMap.set('a', 'first');
  testMap.set('b', 'last');
  Utils.mapFilterInPlace(testMap, v => v !== 'last');
  expect(testMap.get('a')).toBe('first');
  expect(testMap.get('b')).toBeUndefined();
})

it('setFirst', ()=>{
  let testSetA = new Set([1, 2, 3]);
  expect(Utils.setFirst(testSetA)).toEqual(1);
})

it('setFirst', ()=>{
  let testSetA = new Set();
  expect(Utils.setFirst(testSetA)).toBe(undefined);
})

it('setFind', ()=>{
  let testSetA = new Set([1, 2, 3]);
  expect(Utils.setFind(testSetA, (item)=> item === 1)).toEqual(1);
  expect(Utils.setFind(testSetA, (item)=> item === 3)).toEqual(3);
  expect(Utils.setFind(testSetA, (item)=> item === 4)).toEqual(undefined);
})

it('setToggle', ()=>{
  let testSetA = new Set([1, 3]);
  Utils.setToggle(testSetA, 2);

  expect(testSetA.has(2)).toBe(true);
  Utils.setToggle(testSetA, 2);

  expect(testSetA.has(2)).toBe(false);
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

it('setSome', ()=>{
  let testSetA = new Set([1, 2, 3]);
  expect(Utils.setSome(testSetA, (item) => item===1)).toBe(true);
  expect(Utils.setSome(testSetA, (item) => item===undefined)).toBe(false);

  let testSetB = new Set([1, 2, undefined]);
  expect(Utils.setSome(testSetB, (item) => item===1)).toBe(true)
  expect(Utils.setSome(testSetB, (item) => item===undefined)).toBe(true)
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

it('pathProp foo[0] with non-array', ()=>{
  const testObject = {
    foo: ""
  };
  const result = Utils.pathProp(testObject, 'foo[0]');
  expect(result).toBe(undefined);
})

it('pathProp with bad path', ()=>{
  const testObject = {
    foo: ""
  };
  expect(() => Utils.pathProp(testObject, '')).toThrow();
  expect( () => Utils.pathProp(testObject, 'foo.')).toThrow();
  expect(() =>Utils.pathProp(testObject, 'foo..')).toThrow();
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

it('pathPropStore bad path', ()=>{
  const testObject = {
    foo: ""
  };
  expect(() => Utils.pathPropStore(testObject, '',  69)).toThrow();
  expect(() => Utils.pathPropStore(testObject, 'foo..',  69)).toThrow();
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

it('pathPropStore foo[0] when target undefined', ()=>{
  const testObject = {
  };
  Utils.pathPropStore(testObject, 'foo[0]', 'array item 0');
  expect(testObject.foo[0]).toMatch('array item 0');
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

it('propsDiff 2', ()=>{

  let testObjA = { a: 1, b: 2}
  let testObjB = { a: 1 }
  let result = Utils.propsDiff(testObjA, testObjB);
  expect(result).toEqual(['b']);

})

it('propsDiff 3', ()=>{

  let testObjA = { a: 1 }
  let testObjB = { a: 1, b: 1 }
  let result = Utils.propsDiff(testObjA, testObjB);
  expect(result).toEqual(['b']);

})

it('jsonParseNoThrow valid JSON', ()=>{

  let result = Utils.jsonParseNoThrow('{ "a": 1942 }');
  expect(result).toEqual({ "a": 1942} );
})

it('jsonParseNoThrow invalid JSON', ()=>{

  const original = console.error
  console.error = jest.fn()
  let result = Utils.jsonParseNoThrow('{ "a: 1942 }');
  console.error = original

  expect(result).toEqual(null );

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

  jest.useFakeTimers();

  const promise1 = Promise.resolve(3);
  const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
  const promise3 = Promise.reject();

  const promises = [promise1, promise2, promise3];

  jest.runAllTimers();

  Promise.allSettled(promises).
  then((results) => {
    let result = Utils.promiseAllSettledTallyResults(results);
    expect(result).toStrictEqual([1,2]);
  });
})

it('caseUnexpected', ()=>{
  expect( () => Utils.caseUnexpected(42)).toThrow()
})

it('ignorePromise', ()=>{
  jest.useFakeTimers();

  const promise = new Promise((resolve, reject) => setTimeout(resolve, 100, 'foo'));
  jest.runAllTimers();

  promise.then(Utils.ignorePromise);
  // Nothing to test, but the line above should not show a 'promise ignored' warning in the IDE
})

it('ignorePromiseResult', ()=>{
  jest.useFakeTimers();

  const promise = new Promise((resolve, reject) => setTimeout(resolve, 100, 'foo'));
  jest.runAllTimers();

  promise.then(Utils.ignorePromiseResult);
  // Nothing to test, but the line above should not show a 'promise ignored' warning in the IDE
})


