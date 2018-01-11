"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Browser = function () {
  function Browser(browserInstance, config, authFunc) {
    _classCallCheck(this, Browser);

    this.browser = browserInstance;
    this.config = config;
    this.sessions = [];
    this.authFunc = authFunc;
  }

  _createClass(Browser, [{
    key: "loginAs",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
        var loginPage;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.browser.newPage();

              case 2:
                loginPage = _context.sent;
                _context.next = 5;
                return loginPage.goto(this.config.baseUrl);

              case 5:
                _context.next = 7;
                return this.authFunc(loginPage, user);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loginAs(_x) {
        return _ref.apply(this, arguments);
      }

      return loginAs;
    }()

    // async findOrCreatePage({ for: sessionId } = {}) {
    //   let session = find(whereEq({ sessionId }), this.sessions);
    //   if (!session) {
    //     const newPage = await this.browser.newPage();
    //     if (this.config.viewport) {
    //       await newPage.setViewport(this.config.viewport);
    //     }
    //     if (this.config.baseUrl) {
    //       await newPage.goto(this.config.baseUrl);
    //     }
    //     session = { sessionId, page: newPage };
    //     this.sessions.push(session);
    //   }
    //   return session.page;
    // }

    // until chromium localstorage is fixed

  }, {
    key: "createPage",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var newPage;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.browser.newPage();

              case 2:
                newPage = _context2.sent;

                if (!this.config.viewport) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 6;
                return newPage.setViewport(this.config.viewport);

              case 6:
                if (!this.config.baseUrl) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 9;
                return newPage.goto(this.config.baseUrl);

              case 9:
                return _context2.abrupt("return", newPage);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createPage() {
        return _ref2.apply(this, arguments);
      }

      return createPage;
    }()
  }, {
    key: "close",
    value: function close() {
      this.browser.close();
    }
  }]);

  return Browser;
}();

module.exports = Browser;