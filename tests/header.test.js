const Page = require('./helpers/page') // Our Custom implementation

let page;

beforeEach(async () => {
  page = await Page.build()
  await page.goto('localhost:3000')
})

afterEach(async () => {
  await page.close()
})


test('The header has the correct text', async () => {

  const text = await page.getContentOf('a.brand-logo')
  expect(text).toEqual('Blogster')

})

test('Clicking login starts oauth flow', async () => {

  await page.click('.right a')
  const url = page.url()
  expect(url).toMatch(/accounts\.google\.com/)

})
// scenario of Factory is to have a common set of utilities that i can use to create user and session, sig.

// this rest of the logic of page can also be handled by login function

// One approach can be regarding prototyping done in cache(Monkey patching) and other is using Factory

test('When signed in , shows logout button', async () => {

  await page.login()
  const text = await page.getContentOf('a[href="/auth/logout"]')
  expect(text).toEqual('Logout')
})


describe('When logged in', async () => {

  beforeEach(async () => {
    await page.login()
    await page.click('a.btn-floating')
  })
})





describe('When loged in ', () => {
  beforeEach

  test
})