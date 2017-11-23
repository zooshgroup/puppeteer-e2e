const { find, whereEq } = require('ramda');

class Browser {
  constructor(browserInstance, config, authFunc) {
    this.browser = browserInstance;
    this.config = config;
    this.sessions = [];
    this.authFunc = authFunc;
  }

  async loginAs(user) {
    const loginPage = await this.browser.newPage();
    await loginPage.goto(this.config.baseUrl);
    await this.authFunc(loginPage, user);
  }

  async findOrCreatePage({ for: sessionId } = {}) {
    let session = find(whereEq({ sessionId }), this.sessions);
    if (!session) {
      const newPage = await this.browser.newPage();
      if (this.config.viewport) {
        await newPage.setViewport(this.config.viewport);
      }
      if (this.config.baseUrl) {
        await newPage.goto(this.config.baseUrl);
      }
      session = { sessionId, page: newPage };
      this.sessions.push(session);
    }
    return session.page;
  }

  close() {
    this.browser.close();
  }
}


module.exports = Browser;
