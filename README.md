通过puppeteer打开并连接dapp，无需在浏览器中安装插件，不在浏览器中存储私钥。将私钥放在自己可控的脚本当中。
## Github地址
https://github.com/sudaoxyz/web3-puppeteer
>可以在指纹浏览器不可信任的情况下安全使用

由于npm包代码不一定和开源代码完全一致，因此不提供npm安装方式，建议fork本项目，在本地启动：

1. 下载源码或clone
2. 根目录下执行 npm install
3. npm run build
4. 在脚本中引用dist包中的代码（项目中bitBrowser目录下已经提供比特浏览器的脚本示例，运行前执行npm install）

可关注Twitter反馈问题：[eval_social](https://twitter.com/eval_social)


```javascript
const res = await openBrowser(browserId)
const browser = await connectBrowser(res, browserId)

// strict demo （某些app连接不上可以尝试strict模式）
const w3page = await NewPageStrict(browser, [accounts[0]], chains[1])
await w3page.page.goto('https://xxx')
await w3page.SetupStrict()

// normal page
const page = await browser.newPage()
await page.goto('https://izumi.finance/trade/swap');
const izumi = new W3Page(page, [accounts[0]], chains[1])
await izumi.SetUp()
```
