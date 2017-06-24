/**
* 1. Each item in locations array should contain latitude and longitude
* 2. timespan should contain starting and end date in shown format
*/

module.exports = {
  dummyLocations: [
    {
      geocode: {
        latitude: '37',
        longitude: '-95',
      },
      name: 'NewYork',
    },
    {
      geocode: {
        latitude: '30',
        longitude: '-97',
      },
      name: 'Austin',
    },
  ],
  // mm-dd-yyyy Both dates are inclusive.
  timespan: {
    startDate: '2017-01-01',
    endDate: '2017-02-01',
  },
};
