module.exports = {
  attributes: {
    id: {
      type: 'string',
      required: true,
      columnName: '_id',
    },
    name: {
      type: 'string',
      required: true,
    },
    code: {
      type: 'string',
      required: true,
    },
  },
};
