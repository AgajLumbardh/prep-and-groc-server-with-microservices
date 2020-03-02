const ValueError = require('../errors/ValueError');

const DEFAULT_WEIGHT_UNIT = 'gr';
const DEFAULT_VOLUME_UNIT = 'ml';

const defaultUnitConverter = {
  gr: DEFAULT_WEIGHT_UNIT,
  oz: DEFAULT_WEIGHT_UNIT,
  lb: DEFAULT_WEIGHT_UNIT,
  kg: DEFAULT_WEIGHT_UNIT,
  ml: DEFAULT_VOLUME_UNIT,
  tsp: DEFAULT_VOLUME_UNIT,
  tbsp: DEFAULT_VOLUME_UNIT,
  cup: DEFAULT_VOLUME_UNIT,
  pint: DEFAULT_VOLUME_UNIT,
  quart: DEFAULT_VOLUME_UNIT,
  L: DEFAULT_VOLUME_UNIT,
  gal: DEFAULT_VOLUME_UNIT,
  piece: 'piece'
};

module.exports = unit => {
  if (defaultUnitConverter[unit]) {
    return defaultUnitConverter[unit];
  }
  throw new ValueError(`${unit} unit is not accepted.`);
};
