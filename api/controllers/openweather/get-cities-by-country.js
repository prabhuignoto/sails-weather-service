module.exports =  {
  friendlyName: 'Get all cities by country',

  description: 'Lookup and return all cities based on the country name',

  inputs: {
    country: {
      description: 'The name of the country',
      type: 'string',
      required: true,
    },
    limit: {
      type: 'number',
      required: false,
    },
    skip: {
      type: 'number',
      required: false,
    }
  },

  exits: {
    countryNotFound: {
      responseType: '',
      description: 'City not found in the database',
    },

    success: {
      responseType: '',
    }
  },

  fn: async function(inputs, exits) {
    const result = await Cities.find({
      where: {
        country: inputs.country
      },
      limit: inputs.limit,
      skip: inputs.skip,
    });
    if(!result) {
      return exits.cityNotFound();
    }

    return exits.success({result});
  }
};
