#named-js-regexp


Extends JavaScript RegExp with named groups and named backreferences. 
Both are converted to normal JavaScript RegeExp so you will get the same speed, 
except for initial parsing.

Syntax for named groups: `(?<name>expression)`  
Syntax for named backreferences: `\k<name>`  
  
## Install

```sh
npm install named-js-regexp --save
```

## Using with regexp.execGroups
```javascript
var namedRegexp = require("named-js-regexp");

var re=namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?)(:(?<seconds>\\d\\d?))?");
re.execGroups("1:2:33");    // => { hours:"1", minutes:"2", seconds:"33" }
re.execGroups("1");         // => null

```

## Using with regexp.exec
```javascript
var namedRegexp = require("named-js-regexp");

var re=namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?)(:(?<seconds>\\d\\d?))?");
var result=re.exec("1:2");
result.groups();            // => { hours:"1", minutes:"2", seconds:undefined }
result.group("minutes");    // => "2"
result.group("seconds");    // => undefined
```

## Using with regexp.groupsIndices
```javascript
var namedRegexp = require("named-js-regexp");

var re = namedRegexp("(?<hours>\\d\\d?):(?<minutes>\\d\\d?)(:(?<seconds>\\d\\d?))?");
var matches = "1:2".match(re);
matches[re.groupsIndices["hours"]];     // => "1"
matches[re.groupsIndices["seconds"]];   // => undefined
```

## Using named backreferences
```javascript
var namedRegexp = require("named-js-regexp");

var re=namedRegexp("(<(?<elem>\\w+)>).*<\/\\k<elem>>");
var result=re.exec("<div>hi</div>");
result.groups();            // => { elem: "div" }
```

## Handling group name duplication
```javascript
var namedRegexp = require("named-js-regexp");

var re = namedRegexp("(?<digit>((?<a>\\d):(?<b>\\d)))|(?<char>((?<a>\\w):(?<b>\\w)))");
re.groupsIndices;    // => { digit: 1, a: [ 3, 7 ], b: [ 4, 8 ], char: 5 }

var r = re.exec("a:b");
r.groups();          // => { a: "a", b: "b", digit: undefined, char: "a:b" }
r.groups(true);      // => { a: [undefined, "a"], b: [undefined, "b"], digit: undefined, char: "a:b" }
r = re.exec("1:2");
r.groups();          // => { a: "1", b: "2", digit: "1:2", char: undefined }
r.groups(true);      // => { a: ["1", undefined], b: ["2", undefined], digit: "1:2", char: undefined }
```


## Using with successive matches
```javascript
var namedRegexp = require("named-js-regexp");

var re = namedRegexp("(?<x>\\d)(?<y>\\w)", "g");
var r = re.exec("1a2b");
r.groups();              // => { x: '1', y: 'a' }
r = re.exec("1a2b");
r.groups();              // => { x: '2', y: 'b' }
r = re.exec("1a2b");     // => null
```

## API
`regexp=require("named-js-regexp")(expression:string, flags?:string)`  
Returns normal JavaScript RegExp object with some additional properties.

#### regexp
`regexp.exec(expression:string)`  
Performs search for the matches and returns null if no match was found or matched (Array) result.

`regexp.execGroups(expression:string, all?:boolean)`  
Performs search for the matches and returns null if no match was found or name/value dictionary, 
where name is group name and value is matched value. If same group name was defined multiple times and 
parameter all is false (default) then first (from left to right) not undefined value is returned. 
If parameter all is true then returned value is array of all matched values.     

`regexp.groupsIndices`  
Returns name/value mapper where name is group name and value is index that can be used to access matched value by index. 
If same group name was defined multiple times then value is array of all matched indices ordered from left to right as defined in
regular expression. 

#### matched (returned by regexp.exec)

`matched.groups(all?:boolean)`  
Returns name/value dictionary, where name is group name and value is matched value. Check regexp.execGroups 
for info about parameter all.    

`matched.group(name:string, all?:boolean)`  
Returns named group value or undefined if named group was not found. Check regexp.execGroups 
for info about parameter all.  


## NOTES
- Group name should start with '\_$a-zA-Z' and can contain only '\_$a-zA-Z0-9'.
- Backreference should point to already defined named group, otherwise error is thrown. 


## LICENCE
MIT
