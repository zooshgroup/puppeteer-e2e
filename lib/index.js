'use strict';

var _require = require('./TestManager'),
    withBrowser = _require.withBrowser,
    withPage = _require.withPage;

var BrowserManager = require('./BrowserManager');

var _require2 = require('./utils'),
    waitForPredicate = _require2.waitForPredicate,
    parent = _require2.parent;

module.exports = {
  withBrowser: withBrowser,
  withPage: withPage,
  waitForPredicate: waitForPredicate,
  parent: parent,
  BrowserManager: BrowserManager
};