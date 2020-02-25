
const OPERATORS = [
  {
    sign: '>',
    label: 'greater than',
    code: 'GREATER_THAN'
  },
  {
    sign: '<',
    label: 'lower than',
    code: 'LOWER_THAN'
  },
  {
    sign: '=',
    label: 'equal to',
    code: 'EQUAL_TO'
  },
  {
    sign: '!=',
    label: 'different from',
    code: 'NOT_EQUAL_TO'
  },
];

const SORT_DIRECTION = {
  asc: {
    label: 'ascending',
    code: 'ASC'
  },
  desc: {
    label: 'descending',
    code: 'DESC'
  },
  none: {
    label: 'none',
    code: 'NONE'
  }
}

module.exports = {
  OPERATORS,
  SORT_DIRECTION
};