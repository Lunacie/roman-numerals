const RUN_TESTS = true
const COLOR_SHELL = true

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
test_toInt = function(data) {
  console.log(DEFAULT, "\nCAN RETURN ROMAN NUMERAL FROM ARABIC NOTATION :");
  let nb = new RomanNumber();
  data.forEach(function(elem) {
    for (var i = 0; i < elem.set.length; i++) {
      nb.setValue(elem.set[i]);
      message = null;
      try {
        nb._getType();
      }
      catch(e) {
        message = e;
      }
      let res = nb.toInt();
      console.log('%s "%s" = %s, expected:%s%s [passed : %s]',
                  DEFAULT,
                  elem.set[i],
                  res, elem.expects,
                  message ? '(' + message + ')' : '',
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

  /*
  ** 6. this tests the toInt() function
  */
  data = [
    {expects : FAILURE, set: [null, '']},
    {expects : 1, set: ['I']},
    {expects : 3, set: ['III']},
    {expects : FAILURE, set: ['IIII']},
    {expects : 4, set: ['IV']},
    {expects : 5, set: ['V']},
    {expects : 429, set: ['CDXXIX']},
    {expects : 3999, set: ['MMMIM']},
    {expects : FAILURE, set: ['CD1X']},
    {expects : FAILURE, set: ['error']},
    {expects : 1482, set: ['MCDLXXXII']},
    {expects : 1980, set: ['MCMLXXX']},
    {expects : FAILURE, set: ['MMMMCMXCIX']},
    {expects : FAILURE, set: ['MMMMDMXCIX']}
  ];
  test_toInt(data);

}
