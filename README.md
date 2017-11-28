# E2E testing with Puppeteer

This is a library wrapping Puppeteer so that it integrates well with a Mocha environment, providing helpful functions to use during testing.

## API
### class: TestManager

The TestManager module provides two functions which wrap your tests, mainly providing a Puppeteer page/browser instance.

#### useTestConfig(config)

* config <Object>
  * authenticationFunction <async Function>: *must* be given, if you want to use `withPage()` for your tests. Takes two arguments:
    * page <Page>: a Puppeteer page instance to do the authentication on.
    * user <User>: the User object you pass to `withPage()`.
  * pageReadyFunction <async Function>: can be given, if you want to stall the testing waiting for something (certain elements to load). Takes one argument:
    * page <Page>: a Puppeteer page on which your tests will work, to check it for certain conditions.
  * debug <bool>: can be given to enable logging of certain util functions. 
  * ...config: <any>: any number of other keys, passed to Puppeteer as configuration.

Method used for configuring TestManager, allowing authenticated and pre-guarded tests.

#### withBrowser(testCase)

* testCase <async Function>: contains a sequence of custom assertions. Receives one parameter:
  * browser <Browser>: the Puppeteer Browser instance to run the test against. Is destroyed after the test.

Provides your test with a Puppeteer browser instance, which is deallocated property after the test. A typical example of using this:

```javascript
  it('can run a sample test case', withBrowser(async (browser) => {
    const page = await browser.newPage();
    await page.goto(baseUrl);
    await login(page, defaultUser);
    const path = await page.evaluate(() => window.location.pathname);
    expect(path).to.equal('/home');
  }));
```

#### withPage(options, testCase)

* options <Object>
  * user: <User> (required): user to authenticate to the page with.
  * location <Object>
    * url: <string>: can be given to navigate page to a certain url after creation, thus reducing boilerplate in tests. Defaults to null.  
* testCase <async Function>: contains a sequence of custom assertions. Receives two parameters:
  * page <Page>: the Puppeteer Page instance to run the Browser against. Always starts in an authenticated state with the given User.
  * predicates <Object>: contains functions that wait for the passed predicate to be true: *THESE CANNOT BE GIVEN ANY VARIABLES FROM AN OUTSIDE SCOPE* 
    * page: a function returning true or false, run in the console of the browser 
    * element: a function returning true or false, run in the console of the browser 


A more complex test wrapper, `withPage` gives you an authenticated page instance from the browser of the user you defined.


```javascript
  it('can run a sample test case', withBrowser(async (browser) => {
    const page = await browser.newPage();
    await page.goto(baseUrl);
    await login(page, defaultUser);
    const path = await page.evaluate(() => window.location.pathname);
    expect(path).to.equal('/home');
  }));
```
