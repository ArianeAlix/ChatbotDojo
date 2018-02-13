const
  config = require('config'),
  request = require('request-promise');

// Get the config const
const GOOGLE_API_TOKEN = (process.env.GOOGLE_API_TOKEN) ?
  (process.env.GOOGLE_API_TOKEN) :
  config.get('googleApiToken');

const WEATHER_API_TOKEN = (process.env.WEATHER_API_TOKEN) ?
  (process.env.WEATHER_API_TOKEN) :
  config.get('weatherApiToken');

function getGeolocalisation(cityName) {
  return request({
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      key: GOOGLE_API_TOKEN,
      address: cityName
    },
    method: 'GET'
  });
}

function getWeatherForecast(zip) {
  return request({
    uri: 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',fr&APPID=a47b3c0aa16e2e2da29d6665bb04a1d0',
    method: 'GET'
  });
}

module.exports =  {
  getGeolocalisation: getGeolocalisation,
  getWeatherForecast: getWeatherForecast
}
