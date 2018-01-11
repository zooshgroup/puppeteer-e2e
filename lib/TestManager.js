'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BrowserManager = require('./BrowserManager');

var _require = require('./utils'),
    createAssertionFunctions = _require.createAssertionFunctions;

var _require2 = require('ramda'),
    path = _require2.path;

var TestManager = function () {
  function TestManager() {
    _classCallCheck(this, TestManager);
  }

  _createClass(TestManager, [{
    key: 'withBrowser',
    value: function withBrowser(testCase) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var browser;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return BrowserManager.createNew();

              case 3:
                browser = _context.sent;
                _context.next = 6;
                return testCase(browser);

              case 6:
                _context.next = 8;
                return browser.close();

              case 8:
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](0);
                throw _context.t0;

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[0, 10]]);
      }));
    }
  }, {
    key: 'withPage',
    value: function withPage(_ref2, testCase) {
      var _this2 = this;

      var user = _ref2.user,
          location = _ref2.location,
          _ref2$waitFor = _ref2.waitFor,
          waitFor = _ref2$waitFor === undefined ? [] : _ref2$waitFor;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var page, browser, predicates;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                page = null;
                _context2.prev = 1;
                _context2.next = 4;
                return BrowserManager.createNew();

              case 4:
                browser = _context2.sent;
                _context2.next = 7;
                return browser.newPage();

              case 7:
                page = _context2.sent;

                if (!BrowserManager.config.viewport) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 11;
                return page.setViewport(BrowserManager.config.viewport);

              case 11:
                if (!BrowserManager.config.baseUrl) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 14;
                return page.goto(BrowserManager.config.baseUrl);

              case 14:
                _context2.next = 16;
                return BrowserManager.authenticationFunction(page, user);

              case 16:
                predicates = createAssertionFunctions(page, path(['config', 'debug'], BrowserManager));

                if (!(location && location.url)) {
                  _context2.next = 20;
                  break;
                }

                _context2.next = 20;
                return page.goto(location.url);

              case 20:
                if (!BrowserManager.pageReadyFunction) {
                  _context2.next = 23;
                  break;
                }

                _context2.next = 23;
                return BrowserManager.pageReadyFunction(page, waitFor);

              case 23:
                _context2.next = 25;
                return testCase(page, predicates);

              case 25:
                _context2.next = 27;
                return browser.close();

              case 27:
                _context2.next = 35;
                break;

              case 29:
                _context2.prev = 29;
                _context2.t0 = _context2['catch'](1);

                if (!(page !== null)) {
                  _context2.next = 34;
                  break;
                }

                _context2.next = 34;
                return page.close();

              case 34:
                throw _context2.t0;

              case 35:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[1, 29]]);
      }));
    }
  }]);

  return TestManager;
}();

module.exports = new TestManager();