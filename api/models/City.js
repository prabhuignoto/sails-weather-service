module.exports = {
  attributes: {
    id: {
      type: 'string',
      required: true,
      columnName: '_id',
    } ,
    name: {
      type: 'string',
      required: true,
    } ,
    country: {
      type: 'string',
      required: true,
    },
    coord: {
      type: 'ref',
      required: true,
    }
  }
};
