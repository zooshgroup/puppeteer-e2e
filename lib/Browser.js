"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Browser {
  constructor(browserInstance, config, authFunc) {
    this.browser = browserInstance;
    this.config = config;
    this.sessions = [];
    this.authFunc = authFunc;
  }

  loginAs(user) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const loginPage = yield _this.browser.newPage();
      yield loginPage.goto(_this.config.baseUrl);
      yield _this.authFunc(loginPage, user);
    })();
  }

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
  createPage() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const newPage = yield _this2.browser.newPage();
      if (_this2.config.viewport) {
        yield newPage.setViewport(_this2.config.viewport);
      }
      if (_this2.config.baseUrl) {
        yield newPage.goto(_this2.config.baseUrl);
      }
      return newPage;
    })();
  }

  close() {
    this.browser.close();
  }
}

module.exports = Browser;