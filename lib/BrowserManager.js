'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const puppeteer = require('puppeteer');
const { find, whereEq, prop, unless, isNil } = require('ramda');
const Browser = require('./Browser');
const { enhanceBrowser } = require('./utils');

class BrowserManager {

  constructor() {
    this.browsers = [];
  }

  useBrowserOptions(_ref) {
    let { authenticationFunction, pageReadyFunction } = _ref,
        config = _objectWithoutProperties(_ref, ['authenticationFunction', 'pageReadyFunction']);

    this.authenticationFunction = authenticationFunction;
    this.pageReadyFunction = pageReadyFunction;
    this.config = config;
  }

  createNew({ for: user } = {}) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const unmanagedBrowser = enhanceBrowser((yield puppeteer.launch(_extends({}, _this.config, { handleSIGINT: false }))));
      if (!user) {
        return unmanagedBrowser;
      }
      if (!_this.authenticationFunction) {
        throw new Error('Can\'t log user in without providing an authenticationFunction.');
      }
      const browser = new Browser(unmanagedBrowser, _this.config, _this.authenticationFunction);
      _this.browsers.push({ user, browser });
      return browser;
    })();
  }

  findBrowser({ user }) {
    return unless(isNil, prop('browser'), find(whereEq({ user }), this.browsers));
  }

  closeAll() {
    this.browsers.forEach(({ browser }) => {
      browser.close();
    });
  }

}

const browserManager = new BrowserManager();

process.on('SIGINT', () => {
  browserManager.closeAll();
});

module.exports = browserManager;