/**
 * Return built api url.
 * @export
 * @param {any} geocode 
 * @param {any} timeInterval 
 * @param {any} timePeriod 
 * @returns {string}
 */
export default function buildWeatherUrl(
  geocode,
  timeInterval,
  timePeriod,
) {
  const hostname = `https://${process.env.UNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/api/weather`;
  const version = 'v1';
  const geocodeString = `geocode/${geocode.latitude}/${geocode.longitude}`;

  return `${hostname}/${version}/${geocodeString}/forecast/${timeInterval}/${timePeriod}.json`;
}
