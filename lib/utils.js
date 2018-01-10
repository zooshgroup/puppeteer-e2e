'use strict';

let waitForFunction = (() => {
  var _ref = _asyncToGenerator(function* ({ timeout, pollInterval }, fun) {
    for (let i = 0; i < timeout; i += pollInterval) {
      const result = yield fun();
      if (result) {
        return true;
      }
      yield sleep(pollInterval);
    }
    return false;
  });

  return function waitForFunction(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-param-reassign, no-eval */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let _debug = false; // eslint-disable-line

function ChangeLogger(type) {
  let prev = null;
  return (func, result, selector) => {
    if (prev !== result) {
      prev = result;
      if (_debug) {
        console.log(`${type}: ${selector} => ${func.toString()} -> ${result}`);
      }
    }
    return false;
  };
};

const evaluateReactSelector = (() => {
  var _ref2 = _asyncToGenerator(function* (page, selector, reactFunction) {
    const windowFunction = `
    (${reactFunction.toString()})(window.FindReact(document.querySelector('${selector}')));
  `;
    return page.evaluate(windowFunction);
  });

  return function evaluateReactSelector(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})();

const waitForReactPredicate = page => (() => {
  var _ref3 = _asyncToGenerator(function* (selector, reactFunction, { timeout = 4000, pollInterval = 100, condition } = {}) {
    const changeBuffer = ChangeLogger('react');
    const result = waitForFunction({ timeout, pollInterval }, _asyncToGenerator(function* () {
      const reactResult = yield evaluateReactSelector(page, selector, reactFunction);
      const result = condition ? condition(reactResult) : reactResult;
      changeBuffer(reactFunction, result, selector);
      return result;
    }));
    yield sleep(500);
    return result;
  });

  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
})();

const waitForElementPredicate = page => (() => {
  var _ref5 = _asyncToGenerator(function* (selector, pagePredicate, { timeout = 4000, pollInterval = 100, condition } = {}) {
    const changeBuffer = ChangeLogger('page');
    const result = waitForFunction({ timeout, pollInterval }, _asyncToGenerator(function* () {
      try {
        const pageResult = yield page.$eval(selector, pagePredicate);
        const result = condition ? condition(pageResult) : pageResult;
        changeBuffer(pagePredicate, result, selector);
        return result;
      } catch (err) {
        return pagePredicate(null);
      }
    }));
    yield sleep(500);
    return result;
  });

  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
})();

const waitForPagePredicate = (() => {
  var _ref7 = _asyncToGenerator(function* (predicate, { timeout = 4000, pollInterval = 100 } = {}) {
    const changeBuffer = ChangeLogger('global');
    const result = waitForFunction({ timeout, pollInterval }, _asyncToGenerator(function* () {
      const result = yield predicate();
      changeBuffer(predicate, result);
      return result;
    }));
    yield sleep(500);
    return result;
  });

  return function waitForPagePredicate(_x10) {
    return _ref7.apply(this, arguments);
  };
})();

const createAssertionFunctions = (page, debug) => {
  _debug = debug;
  return {
    page: waitForPagePredicate,
    element: waitForElementPredicate(page),
    react: waitForReactPredicate(page)
  };
};

const enhanceBrowser = browser => {
  const oldNewPage = browser.newPage.bind(browser);
  browser.newPage = _asyncToGenerator(function* () {
    const page = yield oldNewPage();
    // eslint-disable-next-line no-underscore-dangle, no-console
    page.on('pageerror', function (msg) {
      return console.log('PAGE ERROR:', msg);
    });
    // page.on('console', (msg) => console.log('PAGE LOG:', ...msg.args.map((log) => log._remoteObject)));
    // return enhancePage(page);
    return page;
  });
  return browser;
};

module.exports = {
  enhanceBrowser,
  createAssertionFunctions
};