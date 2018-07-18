module.exports = {
  friendlyName: 'Autosuggest API for Countries',

  description: 'AutoSuggests the Counry name as the user starts typing',

  inputs: {
    country: {
      type: 'string',
      required: true,
    }
  },

  exists: {
    success: {
      responseType: '',
    },
    countryNotFound: {
      responseType: ''
    }
  },

  fn: async function(inputs, exits) {
    const result = await Country.find({
      name: { startsWith: inputs.country}
    });

    if(!result) {
      return exits.countryNotFound({
        error: 'No Country found.'
      });
    }

    return exits.success({
      countries: result,
    });
  }
};
