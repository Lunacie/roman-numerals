const RUN_TESTS = true
const COLOR_SHELL = true

const FAILURE = -1
const ROMAN = 1
const ARABIC = 2

const VALUES = {
  'M' : 1000,
  'D' : 500,
  'C' : 100,
  'L' : 50,
  'X' : 10,
  'V' : 5,
  'I' : 1
};

function RomanNumber(value) {

  /*
  **  _getType(value)
  ** Returns numeral type, FAILURE, ROMAN or ARABIC,
  ** Throws exceptions if invalid
  */
  this._getType =  function() {
    let value = this._value;

    if (value == null || (typeof value == 'string' && !value)) {
        this._type = FAILURE;
        throw("value required");
      }
    if (typeof value == 'string') {
      if (/^\-?[0-9]*$/.test(value)) {
        value = parseInt(value)
        if (value < 1 || value > 3999) {
          this._type = FAILURE;
          throw("invalid range");
        }
        this._value = value;
        this._type = ARABIC;
      }
      else if (/^([M|D|C|L|X|V|I])*$/.test(value)) {
        if (this._checkRomanIsValid(value))
          this._type = ROMAN;
        else {
            this._type = FAILURE;
            throw("invalid value");
        }
      }
      else {
        this._type = FAILURE;
        throw("invalid value");
      }
    }

    else if (typeof value == 'number') {
      if (value < 1 || value > 3999) {
        this._type = FAILURE;
        throw("invalid range");
      }
      if (value % 1) {
          this._type = FAILURE;
          throw("invalid value");
      }
      this._type = ARABIC;
    }
    return this._type;
  }

  /*
  **  _checkRomanIsValid(str)
  ** Checks if the roman numeral string is valid,
  ** eg: IIX is valid, while IIIIX is not
  */
  this._checkRomanIsValid = function(str) {
      let count = 0;
      let last = null;
      for (var i = 0; i < str.length; i++) {
        if (last != null && last == str[i])
          count += 1;
        else if (last != null)
          count = 0;
        if (count >= 3)
          return false;
        last = str[i];
      }
      return true;
  }

  /*
  **  _buildArrayFromStr(value)
  ** Builds a value array from a roman numeral string
  ** eg MMMDXXVII =>  [1000,1000,1000,500,10,10,5,1,1]
  */
  this._buildArrayFromStr = function() {
      let last = null;
      let res = [];
      for (var i = 0; i < this._value.length; i++) {
        if (last != null && last < VALUES[this._value[i]])
            res[res.length - 1] = VALUES[this._value[i]] - last;
        else
          res.push(VALUES[this._value[i]]);
        last = VALUES[this._value[i]];
      }
      this._valueArray = res;
  }
  /*
  **  _buildArrayFromNb(value)
  ** Builds a value array from an arabic number
  ** eg 1992 =>  [1000, 100, 1000, 10, 100, 1, 1]
  */
  this._buildArrayFromNb = function() {
      let res = [];
      let str = this._value.toString();
      let len = str.length - 1;
      for (var i = 0; i < str.length; i++) {
        let pow = 1;
        for (var j = 0; j < len; j++)
          pow *= 10;

        if ((str[i] >= 1 && str[i] < 4)) {
          for (var k = 0; k < str[i]; k++)
            res.push(pow);
        }
        else if ((str[i] == 4)) {
            res.push(pow);
            res.push(pow / 2 * 10);
        }
        else if ((str[i] == 5)) {
            res.push(pow / 2 * 10);
        }
        else if ((str[i] >= 6 && str[i] < 9)) {
          res.push(pow / 2 * 10);
          for (var k = 0; k < str[i] - 5; k++)
            res.push(pow);
        }
        else if ((str[i] == 9)) {
            res.push(pow);
            res.push(pow * 10);
        }
        len -= 1;
      }
      this._valueArray = res;
  }

  /*
  **  toString()
  ** Returns the roman numeral value
  */
  this.toString = function() {
    if (this._type == FAILURE)
      return FAILURE;
    if (this._type == ROMAN)
      return this._value;
    this._buildArrayFromNb(this._value);
    let res = "XIV";
    return res;
  }




  /*
  ** getters/setters
  */
  this.setValue = function(value) {
    this._value = value;
  }


  /*
  ** ctor : RomanNumber(value)
  */
  this._value = value;
  if (value)
    this._type = this._getType();
}

module.exports = function(value) {
  return new RomanNumber(value);
};



/*
** -----
** TESTS
** -----
*/

/*
** test formatting/misc
*/
const DEFAULT = COLOR_SHELL ? '\033[0m' : '';
const YES = COLOR_SHELL ? '\033[32mYES\033[0m' : 'YES';
const NO = COLOR_SHELL ? "\033[31mNO\033[0m" : 'NO';
format_typeName = function(type) {
  if (type == ARABIC)
    return "arabic";
  if (type == ROMAN)
    return "roman";
  return "invalid";
}
misc_checkIfArraysMatch = function(ar1, ar2) {
  if (ar1.length != ar2.length)
    return false;
  for (var i = 0; i < ar1.length; i++) {
    if (ar1[i] != ar2[i])
      return false;
  }
  return true;
}


/*
** test functions below
*/
test_getType = function(data) {
  console.log(DEFAULT, "\nCAN GET TYPE OF NUMERAL : ");
  let nb = new RomanNumber();
  data.forEach(function(elem) {
    for (var i = 0; i < elem.set.length; i++) {
      nb.setValue(elem.set[i]);
      let message = null;
      try {
        nb._getType();
      }
      catch (e) {
        message = e;
      }
      let type = nb._type;
      console.log('%s %s%s%s type : %s %s [passed : %s]',
                  DEFAULT,
                  elem.set[i] == null ? null : '',
                  typeof(elem.set[i]) == 'string' ? '"'+elem.set[i]+'"': '',
                  typeof(elem.set[i]) == 'number' ? elem.set[i] : '',
                  format_typeName(type),
                  message ? '(' + message + ')' : '',
                  type == elem.expects ? YES: NO);
    }
  })
}
test_checkRomanIsValid = function(data) {
  console.log(DEFAULT, "\nCAN CHECK IF ROMAN NUMERAL STRING IS VALID : ");
  let nb = new RomanNumber();
  data.forEach(function(elem) {
    for (var i = 0; i < elem.set.length; i++) {
      let res = nb._checkRomanIsValid(elem.set[i]);
      console.log('%s %s is %s valid [passed : %s]',
                  DEFAULT,
                  elem.set[i],
                  !res ? 'NOT' : '',
                  res == elem.expects ? YES: NO);
    }
  })
}
test_buildArrayFromStr = function(data) {  console.log(DEFAULT, "\nCAN BUILD VALUE ARRAY FROM ROMAN NUMBER : ");
  let nb = new RomanNumber();
  data.forEach(function(elem) {
    nb.setValue(elem.set[0]);
    nb._getType();
    nb._buildArrayFromStr();
    let res = nb._valueArray;
    let match = misc_checkIfArraysMatch(res, elem.expects);
    console.log('%s for "%s" [%s] %s match expected:[%s] [passed : %s]',
                DEFAULT,
                elem.set[0],
                res.toString(),
                match ? "does" : "does NOT",
                elem.expects.toString(),
                match ? YES: NO);
  })
}
test_buildArrayFromNb = function(data) {
    console.log(DEFAULT, "\nCAN BUILD VALUE ARRAY FROM ARABIC NUMBER : ");
    let nb = new RomanNumber();
    data.forEach(function(elem) {
      nb.setValue(elem.set);
      nb._getType();
      nb._buildArrayFromNb();
      let res = nb._valueArray;
      let match = misc_checkIfArraysMatch(res, elem.expects);
      console.log('%s for "%s" [%s] %s match expected:[%s] [passed : %s]',
                  DEFAULT,
                  elem.set,
                  res.toString(),
                  match ? "does" : "does NOT",
                  elem.expects.toString(),
                  match ? YES: NO);
    })
}
test_toString = function(data) {
  console.log(DEFAULT, "\nCAN RETURN ARABIC NUMERAL FROM ROMAN NOTATION :");
  let nb = new RomanNumber();
  data.forEach(function(elem) {
    nb.setValue(elem.set);
    message = null;
    try {
      nb._getType();
    }
    catch(e) {
      message = e;
    }
    let res = nb.toString();
    console.log('%s %s = "%s", expected:"%s"%s [passed : %s]',
                DEFAULT,
                elem.set,
                res, elem.expects,
                message ? '(' + message + ')' : '',
                res == elem.expects ? YES: NO);
  })
}



/* Let's run tests */
if (RUN_TESTS) {
  /*
  ** 1. this tests the _getType() function
  */
  let data = [
               {expects : FAILURE, set : [null,'', -42,"-42","---42", "-101010--", 10000, 0, 42.42, "42.42", "49999"]},
               {expects : ARABIC, set : [1, 3, 4, 5]},
               {expects : ROMAN, set : ['I', 'III', 'IV', 'V']},
               {expects : ARABIC, set : [1968, '1473', 2999, 3000]},
               {expects : ROMAN, set : ['CDXXIX']},
               {expects : FAILURE, set : ['CD1X', 'error', 'MMMMCMXCIX', 'MMMMDMXCIX', 'IIII']},
               {expects : ROMAN, set : ['MCDLXXXII', 'MCMLXXX']}
             ];
  test_getType(data);

  /*
  ** 2. this tests the _checkRomanIsValid() function
  */
  data = [
    {expects : true, set : ["XC", "I", "IV", "MCMCV", "IIV", "IIIV"]},
    {expects : false, set : ["IIIIV", "IIIIIV", "IIIIIIV", "MMMMDXXVII"]},
  ]
  test_checkRomanIsValid(data);

  /*
  ** 3. this tests the _buildArrayFromStr() function
  */
  data = [
    {expects : [1000], set: ["M"]},
    {expects : [900], set: ["CM"]},
    {expects : [500], set: ["D"]},
    {expects : [400], set: ["CD"]},
    {expects : [100], set: ["C"]},
    {expects : [90], set: ["XC"]},
    {expects : [50], set: ["L"]},
    {expects : [40], set: ["XL"]},
    {expects : [10], set: ["X"]},
    {expects : [9], set: ["IX"]},
    {expects : [5], set: ["V"]},
    {expects : [4], set: ["IV"]},
    {expects : [1], set: ["I"]},
    {expects : [1000, 900, 90, 5], set: ["MCMXCV"]},
    {expects : [1000, 500, 100, 50], set: ["MDCL"]},
    {expects : [1000, 1000, 1000, 500, 10, 10, 5, 1, 1], set: ["MMMDXXVII"]},
  ];
  test_buildArrayFromStr(data);


  /*
  ** 4. this tests the _buildArrayFromNb() function
  */
  data = [
    {expects : [1000, 100, 1000, 50, 10, 1, 10], set: 1969},
    {expects : [10, 1, 5], set: 14},
    {expects : [1000, 100, 1000, 10, 100, 1, 1], set: 1992},
    {expects : [1000,500, 10, 100, 1, 1], set: 1592},
    {expects : [1000, 100, 500, 50, 1, 1], set: 1452},
    {expects : [1000, 500, 50, 1, 1], set: 1552},
    {expects : [1000, 500, 50, 5], set: 1555},
    {expects : [1000, 500, 100, 100, 50, 5], set: 1755},
    {expects : [1, 10], set: 9},
  ];
  test_buildArrayFromNb(data);

  /*
  ** 5. this tests the toString() function
  */
  data = [
    {expects: FAILURE, set: null},
    {expects: FAILURE, set: ''},
    {expects: FAILURE, set: 0},
    {expects: "XLII", set: 42},
    {expects: "XLII", set: "42"},
    {expects: "I", set: 1},
    {expects: "III", set: 3},
    {expects: "IV", set: 4},
    {expects: "V", set: 5},
    {expects: "MCMLXVIII", set: 1968},
    {expects: "XLII", set: "XLII"},
    {expects: "MCDLXXIII", set: 1473},
    {expects: "MMCMXCIX", set: 2999},
    {expects: "MMM", set: 3000},
    {expects: FAILURE, set: 10000},
    {expects: FAILURE, set: "error"}
  ]
  test_toString(data);

}
