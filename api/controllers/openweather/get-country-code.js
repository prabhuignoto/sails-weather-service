module.exports = {
  friendlyName: 'Get Country code',

  description: 'Takes a country name and returns the country code.',

  inputs: {
    country: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      responseType: '',
    },
    countryNotFound: {
      responseType: '',
      description: 'Cannot find the country specified.',
    },
  },

  fn: async function(inputs, exits) {
    let result = await Country.findOne({
      where: {
        name: inputs.country,
      },
      select: ['code'],
    });

    if(!result) {
      return exits.countryNotFound({
        error: 'Country not found.'
      });
    }

    return exits.success({ result });
  }
};

