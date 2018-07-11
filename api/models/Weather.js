module.exports = {
  attributes: {
    country: {
      type: 'string',
      required: true,
    },
    city: {
      type: 'string',
      required: true,
    },
    openWeatherData: {
      type: 'ref',
      required: true,
    },
  },
};
