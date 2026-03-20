async function setLocale(page, locale) {
  // Dynamically extract domain from baseURL to support multi-environment
  const url = new URL(require('./config').config.baseURL);
  await page.context().addCookies([
    {
      name: 'i18n_redirected_lt',
      value: locale,
      domain: url.hostname,
      path: '/',
    },
  ]);
}

module.exports = { setLocale };
