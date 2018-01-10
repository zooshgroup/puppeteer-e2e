'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const BrowserManager = require('./BrowserManager');
const { createAssertionFunctions } = require('./utils');
const { path } = require('ramda');

class TestManager {
  withBrowser(testCase) {
    return _asyncToGenerator(function* () {
      try {
        const browser = yield BrowserManager.createNew();
        yield testCase(browser);
        yield browser.close();
      } catch (err) {
        throw err;
      }
    });
  }

  withPage({ user, location, waitFor = [] }, testCase) {
    return _asyncToGenerator(function* () {
      let page = null;
      try {
        const browser = yield BrowserManager.createNew();

        page = yield browser.newPage();

        if (BrowserManager.config.viewport) {
          yield page.setViewport(BrowserManager.config.viewport);
        }
        if (BrowserManager.config.baseUrl) {
          yield page.goto(BrowserManager.config.baseUrl);
        }
        yield BrowserManager.authenticationFunction(page, user);

        const predicates = createAssertionFunctions(page, path(['config', 'debug'], BrowserManager));

        if (location && location.url) {
          yield page.goto(location.url);
        }
        if (BrowserManager.pageReadyFunction) {
          yield BrowserManager.pageReadyFunction(page, waitFor);
        }
        yield testCase(page, predicates);
        yield browser.close();
      } catch (err) {
        // console.log(err);
        if (page !== null) {
          yield page.close();
        }
        throw err;
      }
    });
  }
}

module.exports = new TestManager();