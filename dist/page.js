"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3Page = void 0;
const fs = require("fs");
const path = require("path");
const define_1 = require("./define");
const service_1 = require("./service");
class W3Page {
    constructor(page, accounts, chainInfo) {
        this.unwrapMsg = (msg) => {
            try {
                return JSON.parse(msg.text());
            }
            catch (error) {
                return {};
            }
        };
        this.page = page;
        this.id = Math.floor((1 + Math.random()) * 100000000);
        this.service = new service_1.Service(accounts, chainInfo);
    }
    ChangeAccounts(accounts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.service.changeAccounts(accounts);
            yield this.sendRequest('metamask_accountsChanged', [accounts[0].address]);
        });
    }
    ChangeChain(chainInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.service.changeChain(chainInfo);
            yield this.sendRequest('metamask_chainChanged', `0x${chainInfo.id.toString(16)}`);
        });
    }
    SetUp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.injectContent(`window.sudao_page_id=${this.id}`);
            yield this.injectFile('./inject/inpage.js');
            yield this.injectFile('./inject/metamask.js');
            this.page.on('console', (message) => __awaiter(this, void 0, void 0, function* () {
                const req = this.unwrapMsg(message);
                if (req.target != define_1.Role.SUDAO_CONTENT_SCRIPT) {
                    return;
                }
                try {
                    const msg = req.data.data;
                    const value = yield this.service.Call(msg.method, msg.params);
                    yield this.sendResponse(msg.id, value);
                }
                catch (error) {
                    console.log(`error:${JSON.stringify(error)}, msg:${JSON.stringify(req)}`);
                }
            }));
        });
    }
    SetupStrict() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.SetUp();
            const content = yield this.page.content();
            yield this.page.setJavaScriptEnabled(true);
            yield this.page.setContent(content);
        });
    }
    injectFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = fs.readFileSync(path.resolve(__dirname, filePath), { encoding: 'utf8' });
            yield this.injectContent(text);
        });
    }
    injectContent(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.evaluate((content) => {
                try {
                    const container = document.head || document.documentElement;
                    const scriptTag = document.createElement('script');
                    scriptTag.setAttribute('async', 'false');
                    scriptTag.textContent = content;
                    container.insertBefore(scriptTag, container.children[0]);
                    // container.removeChild(scriptTag);
                }
                catch (error) {
                    console.error('Web3-puppeteer: injection failed.', error);
                }
            }, text);
        });
    }
    sendResponse(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.evaluate((resp) => {
                window.postMessage(resp, window.location.origin);
            }, (0, define_1.newResponse)(id, value));
        });
    }
    sendRequest(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.evaluate((req) => {
                window.postMessage(req, window.location.origin);
            }, (0, define_1.newRequest)(method, params));
        });
    }
}
exports.W3Page = W3Page;
