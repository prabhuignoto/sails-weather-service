module.exports = {
  friendlyName: 'Get Coordinates for a city',

  description: 'Takes a city name and returns the coordinates for it. optionally takes the country shortcode',

  inputs: {
    city: {
      type: 'string',
      required: true,
    },
    country: {
      type: 'string',
      required: true,
    }
  },

  exits: {
    success: {
      responseType: '',
    },
    cityNotFound: {
      responseType: '',
      description: 'Unable to find a city with that name.'
    },
  },

  fn: async function(inputs, exits) {
    let result = await City.find({
      where: {
        name: inputs.city,
        country: inputs.country,
      },
      select: ['coord'],
    });

    if(!result) {
      return exits.cityNotFound();
    }

    return exits.success({ result });
  }
};
