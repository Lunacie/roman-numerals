const FAILURE = -1
const ROMAN = 1
const ARABIC = 2

function RomanNumber(value) {
  this._value = value;
}

module.exports = function(value) {
  return new RomanNumber(value);
};
