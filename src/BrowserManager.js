const puppeteer = require('puppeteer');
const { find, whereEq, prop, unless, isNil } = require('ramda');
const Browser = require('./Browser');
const { enhanceBrowser } = require('./utils');

class BrowserManager {

  constructor() {
    this.browsers = [];
  }

  useBrowserOptions({ authenticationFunction, readyFunction, ...config }) {
    this.authenticationFunction = authenticationFunction;
    this.readyFunction = readyFunction;
    this.config = config;
  }

  async createNew({ for: user } = {}) {
    const unmanagedBrowser = enhanceBrowser(await puppeteer.launch({ ...this.config, handleSIGINT: false }));
    if (!user) {
      return unmanagedBrowser;
    }
    if (!this.authenticationFunction) {
      throw new Error('Can\'t log user in without providing an authenticationFunction.');
    }
    const browser = new Browser(unmanagedBrowser, this.config, this.authenticationFunction);
    this.browsers.push({ user, browser });
    return browser;
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

