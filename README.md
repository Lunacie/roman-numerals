A javascript roman=>arabic and arabic=>roman numerals converter

## Input
---------
The behaviour of the converter will vary depending on what input it gets.


### Empty input :
* If input is of type string and empty, or if input is null :
    * throws 'missing value' exception, set type to FAILURE

### Number input :
* If the type of input is a number :
    * check if the integer is in range (1, 3999)
        * if it is, input is of type ARABIC
        * if not, throws 'invalid range' exception and set type to FAILURE
    * check if the number has decimal values
        * if it does, throws an 'invalid value' exception and set type to FAILURE

### String input :
* If the type of input is a string :
    * Check if it only contains roman numerals characters
        * if it does, check if the roman numeral is valid :
            * if it is, input is of type ROMAN
            * if it isn't. throws 'Invalid value' exception
    * Check if it only contains numeric characters
        * If it does, use parseInt() to get the integer:
            * Check if values are in range (1, 3999)
                * If it is, input is of type ARABIC
                * It it's not, throws 'Invalid range' exception, and set type to FAILURE
            * No need to check for decimal, as regex doesn't allow '.' character
    * Any other case throws 'Invalid value' exception, sets type to FAILURE

### Example
```sh
// Empty input
var romanNumber01 = new RomanNumber('');       // =>  invalid
var romanNumber02 = new RomanNumber(null);     // =>  invalid

// Number input
var romanNumber03 = new RomanNumber(42);     // =>  Valid, input type : ARABIC
var romanNumber04 = new RomanNumber(101010); // =>  Out of range
var romanNumber05 = new RomanNumber(-42);    // =>  Out of range
var romanNumber06 = new RomanNumber(0);      // =>  Out of range
var romanNumber07 = new RomanNumber(24.54);  // =>  invalid

// String input
var romanNumber08 = new RomanNumber('XIV');   // =>  Valid, input type : ROMAN
var romanNumber09 = new RomanNumber('XXXXIV');// =>  invalid
var romanNumber10 = new RomanNumber('R2D2');  // =>  invalid
var romanNumber11 = new RomanNumber('0');     // =>  parseInt -> Out of range
var romanNumber12 = new RomanNumber('42');    // =>  parseInt -> Valid, input type : ARABIC
var romanNumber13 = new RomanNumber('101010');// =>  parseInt -> Out of range
var romanNumber15 = new RomanNumber('0');     // =>  parseInt -> Out of range
var romanNumber14 = new RomanNumber('-42');   // =>  invalid
var romanNumber16 = new RomanNumber('24.54'); // =>  invalid
```



## How it works
---------

### I. Roman to Arabic numerals conversion
The implementation is O(n)
The following roman numerals : MCMXCV is interpreted as M + CM + XC + V,
or 1000 + (1000 - 100) + (100 - 10) + 5, which is 1995.
The converter will do exactly that.

For each character in the string 'MCMXCV', it's gonna lookup for it's arabic numeral equivalent in a lookup table and push it to an array.

#### Example :
```
var nb1 = RomanNumber('MCMXCV')   // => [1000, 900, 90, 5]
                                  // => 1000 + 900 + 90 + 5 = 95
var nb2 = RomanNumber('MDCL')     // => [1000, 500, 100, 50]
                                  // => 1000 + 500 + 100 + 50 = 1650
var nb3 = RomanNumber('MMMDXXVII')// => [1000, 1000, 1000, 500, 10, 10, 5, 1, 1]
                                  // => 1000 + 1000 + 1000 + 500 + 10 + 10 + 5 + 1 + 1 = 3527 MMMDXXVII

```

### I. Arabic to Roman numerals conversion
The converted goes for an implemtation that is as close as possible to how roman numerals actually work instead of relying on a more static approach. The whole implementation is O(n).
```
The following number : 1321, can interpreted as :
=> 1000       + 300              + 20        + 1
=> (1 * 1000) + (3 * 100)        + (2 * 10)  + (1 * 1)
=>  1000      + (100 + 100+ 100) + (10 + 10) + 1
=>   M           C     C    C       X    X     I
```
We just have to multiply each single digit in the arabic numeral '1321' by the base of exponent 10 power the length of the string minus the position of the character in the string + 1.
Example :
* '3' => 3 * (1 * 10^(len - pos + 1)) => 3 * (1 * 10^2) => __300__

The goal is to extract the right result for for base exponent 10 times the single digit positon in the numeral. In range (1, 3999), it's either 1000, 100, 10, or 1.
```
let pow = 1;
    for (var j = 0; j < len; j++)
        pow *= 10;

// once ready to move on to the next digit :
len += 1;
```

The converted builds an array of values to translate into roman characters by applying the following rules :
* digit between 1 and 3 => just push the factor digit times
```
eg: 2 => digit:2, factor:1  => [1, 1] => II
eg: 20 => digit:2, factor:10 => [10, 10] => XX
eg: 200 => digit:2, factor:100 => [100, 100] => CC
eg: 2000 => digit:2, factor:1000 => [1000, 1000] => MM
```
* digit 4 => push the factor 1 time, then push (factor / 2 * 10)
```
eg: 4 => digit:4, factor:1 => [1,  (1 / 2 * 10)] => [1, 5] => IV
eg: 40 => digit:4, factor:10 => [10,  (10 / 2 * 10)] => [10, 50] => XL
eg: 400 => digit:4, factor:100 => [100,  (100 / 2 * 10)] => [100, 500] => CD
```
* digit 5 => push (factor / 2 * 10)
```
eg: 5 => digit:5, factor:1 => [(1 / 2 * 10)] => [5] => V```
eg: 5 => digit:5, factor:10 => [(10 / 2 * 10)] => [50] => L```
eg: 5 => digit:5, factor:100 => [(100 / 2 * 10)] => [500] => D
```
* digit between 6 and 8  => push (factor / 2 * 10) then push the factor (digit - 5) times
```
eg: 7 => digit:7, factor:1 => [(1 / 2 * 10), 1, 1] => [5, 1, 1] => VII```
eg: 7 => digit:7, factor:10 => [(10 / 2 * 10), 10, 10] => [50, 10, 10] => LXX```
eg: 7 => digit:7, factor:100 => [(100 / 2 * 10), 100, 100] => [500, 100, 100] => DCC
```
* digit 9 => push the factor then push (factor * 10)
```
eg: 9 => digit:9, factor:1 => [1, (1 * 10)] => [1, 10] => IX```
eg: 9 => digit:9, factor:10 => [10, (10 * 10)] => [10, 100] => XC
eg: 9 => digit:9, factor:100 => [100, (100 * 10)] => [100, 1000] => CM
```



## Output
---

* Input is invalid :
    * Output : Always -1
* Input is in arabic notation :
    * Asking for an Integer output:
        * Will return original input
    * Asking for a String output :
        * Will return the value in roman notation
* Input is in roman notation :
    * Asking for a String output:
        * Will return original input
    * Asking for an Integer output :
        * Will return the value in arabic notation
