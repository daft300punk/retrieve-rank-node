/**
 * Configure all libraries
 * Include this module as a main entry point
 */
import decorate from 'decorate-it';
import config from 'config';

decorate.configure({
  debug: config.VERBOSE_LOGGING,
  // Add the properties you don't want logged
  // url contains sensitive info username and password
  removeFields: ['password', 'token', 'accessToken', 'url'],
});
