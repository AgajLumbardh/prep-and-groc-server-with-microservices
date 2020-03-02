const DECIMAL_PLACES = 2;
module.exports = value => {
  if (Number.isInteger(value)) {
    return value;
  }
  return parseFloat((Math.round(value * 100) / 100).toFixed(DECIMAL_PLACES));
};
