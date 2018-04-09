
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
const KEY_ENTRIES = Object.keys(VALUES)
const VALUE_ENTRIES = KEY_ENTRIES.map(k=> VALUES[k]);

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
    let res = "";
    this._valueArray.forEach(function(elem){
      res += KEY_ENTRIES[VALUE_ENTRIES.indexOf(elem)];
    });
    return res;
  }

  /*
  **  toInt()
  ** Returns the arabic numeral value
  */
  this.toInt = function() {
    if (this._type == FAILURE)
      return FAILURE;
    if (this._type == ARABIC)
      return this._value;
    this._buildArrayFromStr(this._value);
    let res = 0;
    this._valueArray.forEach(function(elem){
      res += elem;
    });
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
