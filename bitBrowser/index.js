import { connectBrowser, openBrowser } from './bitbrowser.js';
import { NewPageStrict, W3Page } from '../dist/index.js'
const accounts = [
    { address: '0xE5d2251D30d2bE7126A8776FeB0bc564a7EF940B', key: "******************************************************************" },
    { address: '0xc63870Cf5185483f86E1098fE6b8F7201D6db4aE', key: "******************************************************************" },
    { address: '0x03F6B2069fDa71ADeE65a977CFDAD352dcDC90B7', key: "******************************************************************" },
    { address: '0x2A6dFFBe14b3c1830798db74585745cA6343734f', key: "******************************************************************" }]
const chains = [
    { name: 'zkSync Era', id: 324, rpcUrl: 'https://mainnet.era.zksync.io', blockExplorers: "https://explorer.zksync.io" },
    { name: 'Ethereum', id: 1, rpcUrl: 'https://cloudflare-eth.com', blockExplorers: "https://etherscan.io" },
    { name: 'Goerli', id: 5, rpcUrl: 'https://rpc.ankr.com/eth_goerli', blockExplorers: "https://goerli.etherscan.io" },
    { name: 'Scroll Testnet', id: 534353, rpcUrl: 'https://alpha-rpc.scroll.io/l2', blockExplorers: "https://blockscout.scroll.io" }]
const browserId = 'f5a04988ff3745278618010805b395e2';
(async () => {
    const res = await openBrowser(browserId)
    const browser = await connectBrowser(res, browserId)

    // strict demo
    // const w3page = await NewPageStrict(browser, [accounts[0]], chains[1])
    // await w3page.page.goto('https://xxx')
    // await w3page.SetupStrict()

    // normal page
    const page = await browser.newPage()
    await page.goto('https://izumi.finance/trade/swap');
    const izumi = new W3Page(page, [accounts[0]], chains[1])
    await izumi.SetUp()

    // await page.waitForSelector('input.chakra-input.f1dlhus7.css-kvjvgw')
    // page.type('input.chakra-input.f1dlhus7.css-kvjvgw', '0.1133', { delay: 100 });

})()