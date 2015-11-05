#named-js-regexp


Extends JavaScript RegExp with named groups. Regular expressions 
with named groups are converted to normal JavaScript RegeExp so you will get the same speed, 
except for initial parsing.

Syntax for named groups: `(?<name>expression)`

  
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
result.groups;              // => { hours:"1", minutes:"2", seconds:undefined }
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

## Using with successive matches
```javascript
var namedRegexp = require("named-js-regexp");

var re = namedRegexp("(?<x>\\d)(?<y>\\w)", "g");
var r = re.exec("1a2b");
r.groups;   // => { x: '1', y: 'a' }
r = re.exec("1a2b");
r.groups;   // => { x: '2', y: 'b' }
```

## API
`regexp=require("named-js-regexp")(expression:string, options?:string)`  
returns normal JavaScript RegExp object with some additional properties.

#### regexp
`regexp.exec(expression:string)`  
Performs search for the matches and returns null if no match was found or matched (Array) result.

`regexp.execGroups(expression:string)`  
Performs search for the matches and returns null if no match was found or name/value dictionary, where name is group name and value is matched value.  

`regexp.groupsIndices`  
Returns name/value mapper where name is group name and value is index that can be used to access matched value by index. 

#### matched (returned by regexp.exec)

`matched.groups`  
Name/value dictionary, where name is group name and value is matched value.

`matched.group(name:string)`  
Returns named group value or undefined if named group was not found.   



## LICENCE
MIT
