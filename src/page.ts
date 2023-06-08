import * as fs from 'fs'
import * as path from 'path';
import { Page } from "puppeteer-core";
import { Account, ChainInfo, Role, newRequest, newResponse } from "./define";
import { Service } from './service';


export class W3Page {
    page: Page
    id: number
    service: Service

    constructor(page: Page, accounts: Array<Account>, chainInfo: ChainInfo) {
        this.page = page
        this.id = Math.floor((1 + Math.random()) * 100000000)
        this.service = new Service(accounts, chainInfo)
    }


    async ChangeAccounts(accounts: Array<Account>) {
        this.service.changeAccounts(accounts)
        await this.sendRequest('metamask_accountsChanged', [accounts[0].address])
    }

    async ChangeChain(chainInfo: ChainInfo) {
        this.service.changeChain(chainInfo)
        await this.sendRequest('metamask_chainChanged', `0x${chainInfo.id.toString(16)}`)
    }


    async SetUp() {
        await this.injectContent(`window.sudao_page_id=${this.id}`)
        await this.injectFile('./inject/inpage.js')
        await this.injectFile('./inject/metamask.js')

        this.page.on('console', async (message) => {
            const req = this.unwrapMsg(message)
            if (req.target != Role.SUDAO_CONTENT_SCRIPT) {
                return
            }

            try {
                const msg = req.data.data
                const value = await this.service.Call(msg.method, msg.params)
                await this.sendResponse(msg.id, value)
            } catch (error) {
                console.log(`error:${JSON.stringify(error)}, msg:${JSON.stringify(req)}`)
            }
        })
    }

    private async injectFile(filePath: string) {
        const text = fs.readFileSync(path.resolve(__dirname, filePath), { encoding: 'utf8' })
        await this.injectContent(text)
    }

    private async injectContent(text: string) {
        await this.page.evaluate((content) => {
            try {
                const container = document.head || document.documentElement;
                const scriptTag = document.createElement('script');
                scriptTag.type = 'module';
                scriptTag.textContent = content;
                container.insertBefore(scriptTag, container.children[0]);
                container.removeChild(scriptTag);
            } catch (error) {
                console.error('Web3-puppeteer: injection failed.', error);
            }
        }, text)
    }

    private async sendResponse(id: number, value: any) {
        await this.page.evaluate((resp) => {
            window.postMessage(resp, window.location.origin)
        }, newResponse(id, value))
    }

    private async sendRequest(method: string, params: any) {
        await this.page.evaluate((req) => {
            window.postMessage(req, window.location.origin)
        }, newRequest(method, params))
    }

    private unwrapMsg = (msg: any) => {
        try {
            return JSON.parse(msg.text())
        } catch (error) {
            return {}
        }
    }
}