const { withBrowser, withPage } = require('./TestManager');
const BrowserManager = require('./BrowserManager');
const { waitForPredicate, parent } = require('./utils');

module.exports = {
  withBrowser,
  withPage,
  waitForPredicate,
  parent,
  BrowserManager,
};
