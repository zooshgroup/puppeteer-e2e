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

  withPage({ user, location }, testCase) {
    return async () => {
      let page = null;
      try {
        let browser = await BrowserManager.findBrowser({ user });

        if (!browser) {
          browser = await BrowserManager.createNew({ for: user });
          if (user) {
            await browser.loginAs(user);
          }
        }
        // const sessionId = isNil(session) ? Math.random() : session;
        page = await browser.findOrCreatePage({ for: Math.random() });
        const predicates = createAssertionFunctions(page, path(['config', 'debug'], BrowserManager));
        if (location && location.url) {
          await page.goto(location.url);
        }
        if (BrowserManager.readyFunction) {
          await BrowserManager.readyFunction(page);
        }
        await testCase(page, predicates);
        await page.close();
      } catch (err) {
        if (page !== null) {
          await page.close();
        }
        throw err;
      }
    };
  }
}

module.exports = new TestManager();