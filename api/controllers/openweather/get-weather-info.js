const fetch = require('node-fetch');
const dateFNS = require('date-fns');
const weatherProperties = ['time','summary', 'icon', 'temperatureHigh', 'temperatureLow', 'pressure', 'windSpeed', 'visibility', 'ozone', 'humidity'];

const parseHourly = function(hourly) {
  return _.map(hourly, item => _.pick(item, weatherProperties));
};

const parseCurrenlty = function(darkskyData) {
  return Object.assign(darkskyData, {
    currently: _.pick(darkskyData.currently, weatherProperties)
  });
};



module.exports = {
  friendlyName: 'Get\'s Darksky\'s Weather data and caches it in the DB.',

  description: 'Pulls 5day forecast from the openweather API and cahces for certain timeperiod.',

  inputs: {
    lat: {
      type: 'number',
      required: true,
    },
    lng: {
      type: 'number',
      required: true,
    },
    exclude: {
      type: 'ref',
      required: false,
      defaultsTo: ['minutely', 'hourly']
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

  fn: async function({ lat, lng, exclude }, exits) {
    const { FORECAST_URL, API_KEY } = sails.config.darksky;
    const url = `${FORECAST_URL}/${API_KEY}/${lat},${lng}?exclude=${exclude.join(',')}`;
    let newWeatherData = null;

    const existingWeatherData = await Weather.findOne({
      lat,
      lng,
    });
    const hasDataExpired = function({ updatedAt }) {
      if(updatedAt) {
        return dateFNS.differenceInMinutes(new Date(), new Date(updatedAt)) > 30;
      }
      return true;
    };

    // if the weatherdata does not exists, fetch it
    if(!existingWeatherData) {
      const response = await fetch(url);
      const skyData = await response.json();
      let newWeatherData = null;

      const weatherData = Object.assign(skyData, {
        daily: Object.assign(skyData.daily, {
          data: _.map(skyData.daily.data, item => _.pick(item, weatherProperties))
        }),
        currently: _.pick(skyData.currently, weatherProperties)
      });

      if(weatherData.code !== '400') {
        newWeatherData = await Weather.create({
          lat,
          lng,
          weatherData,
        }).fetch();
      }

      return exits.success( { weatherData: newWeatherData });
    } else if(hasDataExpired(existingWeatherData)){
      const response = await fetch(url);
      const skyData = await response.json();
      let newWeatherData = null;

      const weatherData = Object.assign(skyData, {
        daily: Object.assign(skyData.daily, {
          data: _.map(skyData.daily.data, item => _.pick(item, weatherProperties))
        }),
        currently: _.pick(skyData.currently, weatherProperties)
      });

      if(weatherData.cod !== '404') {
        newWeatherData = await Weather.update({
          lat,
          lng,
        },{
          weatherData,
        }).fetch();
      }

      return exits.success( { weatherData: newWeatherData[0] });

    } else if(existingWeatherData) {
      return exits.success( { weatherData: existingWeatherData });
    } else {
      return exits.failed({ error: 'unable to get the weather data '});
    }

  }
};




