class DarkskyParser {

  static settings() {
    return {
      weatherProperties: ['time','summary', 'icon', 'temperature', 'pressure', 'windSpeed', 'visibility', 'ozone'],
    };
  }
  
  static parseHourly(darkskyData) {
    return Object.assign(darkskyData, {
      data: Lodash.map(darkskyData.data, item => Lodash.pick(item, DarkskyParser.settings()))
    });
  }

  static parseCurrenlty(darkskyData) {
    return Object.assign(darkskyData, {
      currently: Lodash.pick(darkskyData.currently, DarkskyParser.settings().weatherProperties)
    });
  }

}
