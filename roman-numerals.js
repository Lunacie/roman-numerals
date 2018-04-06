const RUN_TESTS = true
const COLOR_SHELL = true

const FAILURE = -1
const ROMAN = 1
const ARABIC = 2

function RomanNumber(value) {
  this._value = value;


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


/*
** test functions below
*/
test_getType = function(data) {
  console.log(DEFAULT, "\nCAN GET TYPE OF NUMERAL : ");
  let nb = new RomanNumber();
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

}
