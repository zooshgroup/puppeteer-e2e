const BrowserManager = require('./BrowserManager');
const { createAssertionFunctions } = require('./utils');
const { path } = require('ramda');

class TestManager {
  withBrowser(testCase) {
    return async () => {
      try {
        const browser = await BrowserManager.createNew();
        await testCase(browser);
        await browser.close();
      } catch (err) {
        throw err;
      }
    };
  }

  withPage({ user, location, waitFor = [] }, testCase) {
    return async () => {
      let page = null;
      try {
        const browser = await BrowserManager.createNew();

        page = await browser.newPage();


        if (BrowserManager.config.viewport) {
          await page.setViewport(BrowserManager.config.viewport);
        }
        if (BrowserManager.config.baseUrl) {
          await page.goto(BrowserManager.config.baseUrl);
        }
        await BrowserManager.authenticationFunction(page, user);

        const predicates = createAssertionFunctions(page, path(['config', 'debug'], BrowserManager));

        if (location && location.url) {
          await page.goto(location.url);
        }
        if (BrowserManager.pageReadyFunction) {
          await BrowserManager.pageReadyFunction(page, waitFor);
        }
        await testCase(page, predicates);
        await browser.close();
      } catch (err) {
        // console.log(err);
        if (page !== null) {
          await page.close();
        }
        throw err;
      }
    };
  }
}

module.exports = new TestManager();
