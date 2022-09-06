declare module 'mreq-utils' {

  export function notNil(x: any): boolean;

  export function stringCompareLoose(s1:string, s2:string): number;

  export function stringEqualLoose(s1:string, s2:string): boolean;

  export function isNonEmptyString(s:string): boolean;

  export function stringTrimFileExtension(s: string): string;

  export function arrayFirst(a: Array<any>): any | undefined;

  export function arrayLast(a: Array<any>): any | undefined;

  export function arrayRemoveIndex(a: Array<any>, i: number);

  export function mapSome(map: object, predicate: (any) => boolean);

  export function mapFilterInPlace(map: object, predicate: (any) => boolean);

  export function sortedStringArrayFindFirstAndLast(list: Array<string>, prefix:string): [number, number];

  export function sortedArrayFindFirstAndLast(list: Array<any>, prefix:string, valueGetter: (any) => string): [number, number];

  export function sortedStringArrayCollate(a: Array<string>, b: Array<string>): Array<string>;

  export function sortedArrayCollate(a: Array<any>, b: Array<any>, valueGetter: (any) => string): Array<any>;

  export function setFirst(s: Set<any>): any;

  export function setFind(s: Set<any>, predicate: (any) => boolean): any;

  export function setToggle(s: Set<any>, value: any);

  export function setSome(set: Set<any>, predicate: (any) => boolean): boolean;

  export function setMergeInPlace(destination: Set<any>, source: Set<any>);

  export function setsMerge(sets: Array<Set<any>>): Set<any>;

  export function domClosest(e: HTMLElement, predicate: (HTMLElement) => boolean): HTMLElement | null;

  export function domIsDescendant(ancestor: HTMLElement, potentialDescendant: HTMLElement): boolean;

  export function isFunction(foo: any): boolean;

  export function formatMailToLink(emailAddress: string): string;

  export function objectToQueryString(obj: object): string;

  export function arrayToQueryParams(array: Array<string | number | boolean>, paramName: string): string;

  export function pathProp(object: object, path: string): any;

  export function pathPropStore(object: object, path: string, value: any);

  export function propsDiff(a: object, b: object): Array<string>;

  export function jsonParseNoThrow(s: string): null | any;

  export function arrayOrUndefinedToSet(val: Array<any> | undefined, callback: (Set<any>));

  export function dateInputValueToTimeStamp(yyyymmdd: string): number;

  export function timeStampToDateInputValue(ts: number): string;

  export function promiseAllSettledTallyResults(resultsIterable: Iterable<any>): [number, number];

  export function caseUnexpected(v: any);

  export function ignorePromise();

  export function ignorePromiseResult();
}



