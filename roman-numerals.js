const RUN_TESTS = true
const COLOR_SHELL = true

const FAILURE = -1
const ROMAN = 1
const ARABIC = 2

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


}
