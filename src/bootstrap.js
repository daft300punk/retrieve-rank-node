/**
 * Configure all libraries
 * Include this module as a main entry point
 */
import decorate from 'decorate-it';
import config from 'config';

decorate.configure({
  debug: config.VERBOSE_LOGGING,
});
