const ValueError = require('../errors/ValueError');
const formatNumber = require('./formatNumber');

const KG_TO_GRAM_RATIO = 1000;
const POUND_TO_GRAM_RATIO = 453.592;
const OUNCE_TO_GRAMS_RATIO = 28.3495;

const TSP_TO_ML_RATIO = 5;
const TBSP_TO_ML_RATIO = 14.786;
const CUP_TO_ML = 236.588;
const PINT_TO_ML = 473.176;
const QUART_TO_ML = 946.353;
const LITER_TO_ML_RATIO = 1000;
const GALLON_TO_ML = 3785.41;

const defaultAmountConverter = {
  gr: amount => amount,
  oz: amount => amount * OUNCE_TO_GRAMS_RATIO,
  lb: amount => amount * POUND_TO_GRAM_RATIO,
  kg: amount => amount * KG_TO_GRAM_RATIO,
  ml: amount => amount,
  tsp: amount => amount * TSP_TO_ML_RATIO,
  tbsp: amount => amount * TBSP_TO_ML_RATIO,
  cup: amount => amount * CUP_TO_ML,
  pint: amount => amount * PINT_TO_ML,
  quart: amount => amount * QUART_TO_ML,
  L: amount => amount * LITER_TO_ML_RATIO,
  gal: amount => amount * GALLON_TO_ML,
  piece: amount => amount
};

module.exports = ({ unit, amount }) => {
  if (defaultAmountConverter[unit]) {
    return formatNumber(defaultAmountConverter[unit](amount));
  }
  throw new ValueError(`${unit} unit is not accepted`);
};
