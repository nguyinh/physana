
const OPERATORS = [
  {
    label: '>',
    code: 'GREATER_THAN'
  },
  {
    label: '<',
    code: 'LOWER_THAN'
  },
  {
    label: '=',
    code: 'EQUAL_TO'
  },
  {
    label: '!=',
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