'use strict';

var waitForFunction = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2, fun) {
    var timeout = _ref2.timeout,
        pollInterval = _ref2.pollInterval;
    var i, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = 0;

          case 1:
            if (!(i < timeout)) {
              _context.next = 12;
              break;
            }

            _context.next = 4;
            return fun();

          case 4:
            result = _context.sent;

            if (!result) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', true);

          case 7:
            _context.next = 9;
            return sleep(pollInterval);

          case 9:
            i += pollInterval;
            _context.next = 1;
            break;

          case 12:
            return _context.abrupt('return', false);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function waitForFunction(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-param-reassign, no-eval */
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

var _debug = false; // eslint-disable-line

function ChangeLogger(type) {
  var prev = null;
  return function (func, result, selector) {
    if (prev !== result) {
      prev = result;
      if (_debug) {
        console.log(type + ': ' + selector + ' => ' + func.toString() + ' -> ' + result);
      }
    }
    return false;
  };
};

var evaluateReactSelector = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(page, selector, reactFunction) {
    var windowFunction;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            windowFunction = '\n    (' + reactFunction.toString() + ')(window.FindReact(document.querySelector(\'' + selector + '\')));\n  ';
            return _context2.abrupt('return', page.evaluate(windowFunction));

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function evaluateReactSelector(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var waitForReactPredicate = function waitForReactPredicate(page) {
  return function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(selector, reactFunction) {
      var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref5$timeout = _ref5.timeout,
          timeout = _ref5$timeout === undefined ? 4000 : _ref5$timeout,
          _ref5$pollInterval = _ref5.pollInterval,
          pollInterval = _ref5$pollInterval === undefined ? 100 : _ref5$pollInterval,
          condition = _ref5.condition;

      var changeBuffer, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              changeBuffer = ChangeLogger('react');
              result = waitForFunction({ timeout: timeout, pollInterval: pollInterval }, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var reactResult, result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return evaluateReactSelector(page, selector, reactFunction);

                      case 2:
                        reactResult = _context3.sent;
                        result = condition ? condition(reactResult) : reactResult;

                        changeBuffer(reactFunction, result, selector);
                        return _context3.abrupt('return', result);

                      case 6:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              })));
              _context4.next = 4;
              return sleep(500);

            case 4:
              return _context4.abrupt('return', result);

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function (_x6, _x7) {
      return _ref4.apply(this, arguments);
    };
  }();
};

var waitForElementPredicate = function waitForElementPredicate(page) {
  return function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(selector, pagePredicate) {
      var _ref8 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref8$timeout = _ref8.timeout,
          timeout = _ref8$timeout === undefined ? 4000 : _ref8$timeout,
          _ref8$pollInterval = _ref8.pollInterval,
          pollInterval = _ref8$pollInterval === undefined ? 100 : _ref8$pollInterval,
          condition = _ref8.condition;

      var changeBuffer, result;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              changeBuffer = ChangeLogger('page');
              result = waitForFunction({ timeout: timeout, pollInterval: pollInterval }, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var pageResult, _result;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.prev = 0;
                        _context5.next = 3;
                        return page.$eval(selector, pagePredicate);

                      case 3:
                        pageResult = _context5.sent;
                        _result = condition ? condition(pageResult) : pageResult;

                        changeBuffer(pagePredicate, _result, selector);
                        return _context5.abrupt('return', _result);

                      case 9:
                        _context5.prev = 9;
                        _context5.t0 = _context5['catch'](0);
                        return _context5.abrupt('return', pagePredicate(null));

                      case 12:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, undefined, [[0, 9]]);
              })));
              _context6.next = 4;
              return sleep(500);

            case 4:
              return _context6.abrupt('return', result);

            case 5:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    return function (_x9, _x10) {
      return _ref7.apply(this, arguments);
    };
  }();
};

var waitForPagePredicate = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(predicate) {
    var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref11$timeout = _ref11.timeout,
        timeout = _ref11$timeout === undefined ? 4000 : _ref11$timeout,
        _ref11$pollInterval = _ref11.pollInterval,
        pollInterval = _ref11$pollInterval === undefined ? 100 : _ref11$pollInterval;

    var changeBuffer, result;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            changeBuffer = ChangeLogger('global');
            result = waitForFunction({ timeout: timeout, pollInterval: pollInterval }, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
              var result;
              return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return predicate();

                    case 2:
                      result = _context7.sent;

                      changeBuffer(predicate, result);
                      return _context7.abrupt('return', result);

                    case 5:
                    case 'end':
                      return _context7.stop();
                  }
                }
              }, _callee7, undefined);
            })));
            _context8.next = 4;
            return sleep(500);

          case 4:
            return _context8.abrupt('return', result);

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function waitForPagePredicate(_x12) {
    return _ref10.apply(this, arguments);
  };
}();

var createAssertionFunctions = function createAssertionFunctions(page, debug) {
  _debug = debug;
  return {
    page: waitForPagePredicate,
    element: waitForElementPredicate(page),
    react: waitForReactPredicate(page)
  };
};

var enhanceBrowser = function enhanceBrowser(browser) {
  var oldNewPage = browser.newPage.bind(browser);
  browser.newPage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var page;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return oldNewPage();

          case 2:
            page = _context9.sent;

            // eslint-disable-next-line no-underscore-dangle, no-console
            page.on('pageerror', function (msg) {
              return console.log('PAGE ERROR:', msg);
            });
            // page.on('console', (msg) => console.log('PAGE LOG:', ...msg.args.map((log) => log._remoteObject)));
            // return enhancePage(page);
            return _context9.abrupt('return', page);

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));
  return browser;
};

module.exports = {
  enhanceBrowser: enhanceBrowser,
  createAssertionFunctions: createAssertionFunctions
};