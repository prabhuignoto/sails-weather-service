const fetch = require('node-fetch');
const dateFNS = require('date-fns');

module.exports = {
  friendlyName: 'Get\'s OpenWeather Data and caches.',

  description: 'Pulls 5day forecast from the openweather API and cahces for certain timeperiod.',

  inputs: {
    latitude: {
      type: 'string',
      required: false,
    },
    longitude: {
      type: 'string',
      required: false,
    },
    country: {
      type: 'string',
      required: true,
    },
    city: {
      type: 'string',
      required: true,
    }
  },

  exits: {
    success: {
      responseType: '',
    },
    failed: {
      responseType: '',
    }
  },

  fn: async function({ city, country }, exits) {
    const { foreCastURL, API_KEY } = sails.config.openWeather;
    const url = `${foreCastURL}?q=${city}&appid=${API_KEY}`;
    let newWeatherData = null;

    const existingWeatherData = await Weather.findOne({
      city,
      country,
    });
    const hasDataExpired = function({ updatedAt }) {
      if(updatedAt) {
        return dateFNS.differenceInMinutes(new Date(), new Date(updatedAt)) > 10;
      }
      return true;
    };

    // if the weatherdata does not exists, fetch it
    if(!existingWeatherData) {
      const response = await fetch(url);
      const weatherData = await response.json();

      if(weatherData.cod !== '404') {
        newWeatherData = await Weather.create({
          country,
          city,
          openWeatherData: weatherData,
        }).fetch();
      } else {
        newWeatherData = weatherData;
      }

      return exits.success( { weatherData: newWeatherData });
    } else if(hasDataExpired(existingWeatherData)){
      const response = await fetch(url);
      const weatherData = await response.json();

      if(weatherData.cod !== '404') {
        newWeatherData = await Weather.update({
          country,
          city,
        },{
          openWeatherData: weatherData,
        }).fetch();
      } else {
        newWeatherData = weatherData;
      }

      return exits.success( { weatherData: newWeatherData });
    } else if(existingWeatherData) {
      return exits.success( { weatherData: existingWeatherData });
    } else {
      return exits.failed({ error: 'unable to get the weather data '});
    }

  }
};




