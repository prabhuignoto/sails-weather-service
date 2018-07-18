module.exports = {
  friendlyName: 'Autosuggest API for Cities',

  description: 'AutoSuggests the City name as the user starts typing',

  inputs: {
    city: {
      type: 'string',
      required: true,
    },
    countryCode: {
      type: 'string',
      required: true,
    }
  },

  exists: {
    success: {
      responseType: '',
    },
    cityNotFound: {
      responseType: ''
    }
  },

  fn: async function(inputs, exits) {
    const result = await City.find({
      name: { startsWith: inputs.city},
      country: inputs.countryCode,
    });

    if(!result) {
      return exits.cityNotFound({
        error: 'No City found.'
      });
    }

    return exits.success({
      cities: result,
    });
  }
};
