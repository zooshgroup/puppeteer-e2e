/* eslint-disable no-param-reassign, no-eval */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function waitForFunction({ timeout, pollInterval }, fun) {
  for (let i = 0; i < timeout; i += pollInterval) {
    const result = await fun();
    if (result) {
      return true;
    }
    await sleep(pollInterval);
  }
  return false;
}


const evaluateReactSelector = async (page, selector, reactFunction) => {
  const windowFunction = `
    (${reactFunction.toString()})(window.FindReact(document.querySelector('${selector}')));
  `;
  return page.evaluate(windowFunction);
};

const waitForReactPredicate = (page) => async (selector, reactFunction, { timeout = 4000, pollInterval = 100, condition } = {}) => {
  const changeBuffer = ChangeLogger('react');
  const result = waitForFunction({ timeout, pollInterval }, async () => {
    const reactResult = await evaluateReactSelector(page, selector, reactFunction);
    const result = condition ? condition(reactResult) : reactResult;
    changeBuffer(reactFunction, result, selector);
    return result;
  });
  await sleep(500);
  return result;
};

const waitForElementPredicate = (page) => async (selector, pagePredicate, { timeout = 4000, pollInterval = 100, condition } = {}) => {
  const changeBuffer = ChangeLogger('page');
  const result = waitForFunction({ timeout, pollInterval }, async () => {
    try {
      const pageResult = await page.$eval(selector, pagePredicate);
      const result = condition ? condition(pageResult) : pageResult;
      changeBuffer(pagePredicate, result, selector);
      return result;
    } catch (err) {
      return pagePredicate(null);
    }
  });
  await sleep(500);
  return result;
};

const waitForPagePredicate = async (predicate, { timeout = 4000, pollInterval = 100 } = {}) => {
  const changeBuffer = ChangeLogger('global');
  const result = waitForFunction({ timeout, pollInterval }, async () => {
    const result = await predicate();
    changeBuffer(predicate, result);
    return result;
  });
  await sleep(500);
  return result;
};

const createAssertionFunctions = (page, debug) => {
  _debug = debug;
  return {
    page: waitForPagePredicate,
    element: waitForElementPredicate(page),
    react: waitForReactPredicate(page),
  };
};


const enhanceBrowser = (browser) => {
  const oldNewPage = browser.newPage.bind(browser);
  browser.newPage = async () => {
    const page = await oldNewPage();
    // eslint-disable-next-line no-underscore-dangle, no-console
    page.on('pageerror', (msg) => console.log('PAGE ERROR:', msg));
    // page.on('console', (msg) => console.log('PAGE LOG:', ...msg.args.map((log) => log._remoteObject)));
    // return enhancePage(page);
    return page;
  };
  return browser;
};

module.exports = {
  enhanceBrowser,
  createAssertionFunctions,
};
