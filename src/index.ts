import { Browser } from 'puppeteer-core'
import { Account, ChainInfo } from './define'
import { W3Page } from './page'

export * from './define'
export * from './page'
export * from './service'

export const NewPageStrict = async (browser: Browser, accounts: Array<Account>, chainInfo: ChainInfo): Promise<W3Page> => {
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(false)
    return new W3Page(page, accounts, chainInfo)
}