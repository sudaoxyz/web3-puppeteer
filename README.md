通过puppeteer打开dapp，在无插件的情况下，可以自动连接dapp。需要在脚本中配置私钥。

```javascript
const res = await openBrowser(browserId)
const browser = await connectBrowser(res, browserId)

// strict demo
const w3page = await NewPageStrict(browser, [accounts[0]], chains[1])
await w3page.page.goto('https://www.nftsniper.club/')
await w3page.SetupStrict()

// normal page
const page = await browser.newPage()
await page.goto('https://izumi.finance/trade/swap');
const izumi = new W3Page(page, [accounts[0]], chains[1])
await izumi.SetUp()
```