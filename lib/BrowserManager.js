'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var puppeteer = require('puppeteer');

var _require = require('ramda'),
    find = _require.find,
    whereEq = _require.whereEq,
    prop = _require.prop,
    unless = _require.unless,
    isNil = _require.isNil;

var Browser = require('./Browser');

var _require2 = require('./utils'),
    enhanceBrowser = _require2.enhanceBrowser;

var BrowserManager = function () {
  function BrowserManager() {
    _classCallCheck(this, BrowserManager);

    this.browsers = [];
  }

  _createClass(BrowserManager, [{
    key: 'useBrowserOptions',
    value: function useBrowserOptions(_ref) {
      var authenticationFunction = _ref.authenticationFunction,
          pageReadyFunction = _ref.pageReadyFunction,
          config = _objectWithoutProperties(_ref, ['authenticationFunction', 'pageReadyFunction']);

      this.authenticationFunction = authenticationFunction;
      this.pageReadyFunction = pageReadyFunction;
      this.config = config;
    }
  }, {
    key: 'createNew',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            user = _ref3.for;

        var unmanagedBrowser, browser;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = enhanceBrowser;
                _context.next = 3;
                return puppeteer.launch(_extends({}, this.config, { handleSIGINT: false }));

              case 3:
                _context.t1 = _context.sent;
                unmanagedBrowser = (0, _context.t0)(_context.t1);

                if (user) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return', unmanagedBrowser);

              case 7:
                if (this.authenticationFunction) {
                  _context.next = 9;
                  break;
                }

                throw new Error('Can\'t log user in without providing an authenticationFunction.');

              case 9:
                browser = new Browser(unmanagedBrowser, this.config, this.authenticationFunction);

                this.browsers.push({ user: user, browser: browser });
                return _context.abrupt('return', browser);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createNew() {
        return _ref2.apply(this, arguments);
      }

      return createNew;
    }()
  }, {
    key: 'findBrowser',
    value: function findBrowser(_ref4) {
      var user = _ref4.user;

      return unless(isNil, prop('browser'), find(whereEq({ user: user }), this.browsers));
    }
  }, {
    key: 'closeAll',
    value: function closeAll() {
      this.browsers.forEach(function (_ref5) {
        var browser = _ref5.browser;

        browser.close();
      });
    }
  }]);

  return BrowserManager;
}();

var browserManager = new BrowserManager();

process.on('SIGINT', function () {
  browserManager.closeAll();
});

module.exports = browserManager;