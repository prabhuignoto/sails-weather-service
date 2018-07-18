module.exports = {
  attributes: {
    lat: {
      type: 'number',
      required: true,
    },
    lng: {
      type: 'number',
      required: true,
    },
    weatherData: {
      type: 'ref',
      required: true,
    },
  },
};
