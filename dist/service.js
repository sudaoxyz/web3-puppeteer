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
exports.Service = void 0;
const ethers_1 = require("ethers");
class Service {
    constructor(accounts, chainInfo) {
        this.accounts = accounts;
        this.chainInfo = chainInfo;
        this.provider = new ethers_1.JsonRpcProvider(chainInfo.rpcUrl);
    }
    getSigner(address) {
        for (const account of this.accounts) {
            if (account.address == address) {
                return new ethers_1.Wallet(account.key);
            }
        }
        return;
    }
    changeAccounts(accounts) {
        this.accounts = accounts;
    }
    changeChain(chainInfo) {
        this.chainInfo = chainInfo;
        this.provider = new ethers_1.JsonRpcProvider(chainInfo.rpcUrl);
    }
    // eip1193
    eth_gasPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            const feeData = yield this.provider.getFeeData();
            return feeData.gasPrice.toString(10);
        });
    }
    eth_requestAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = [];
            for (const account of this.accounts) {
                res.push(account.address);
            }
            return res;
        });
    }
    eth_coinbase() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eth_requestAccounts();
        });
    }
    eth_accounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eth_requestAccounts();
        });
    }
    eth_blockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.getBlockNumber();
        });
    }
    eth_chainId() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.provider.getNetwork();
            return (0, ethers_1.toQuantity)(result.chainId);
        });
    }
    eth_getBalance(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.provider.getBalance(params[0], params[1]);
            return (0, ethers_1.toQuantity)(result);
        });
    }
    //todo
    eth_getStorageAt(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.getStorage(params[0], params[1], params[2]);
        });
    }
    eth_getTransactionCount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.provider.getTransactionCount(params[0], params[1]);
            return (0, ethers_1.toQuantity)(result);
        });
    }
    eth_getBlockTransactionCountByHash(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.provider.getBlock(params[0]);
            return (0, ethers_1.toQuantity)(result.transactions.length);
        });
    }
    eth_getBlockTransactionCountByNumber(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eth_getBlockTransactionCountByHash(params);
        });
    }
    eth_getCode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.getCode(params[0], params[1]);
        });
    }
    eth_sendRawTransaction(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.broadcastTransaction(params[0]);
        });
    }
    eth_sendTransaction(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = params[0].from;
            if (this.accounts.indexOf(address) < 0) {
                return;
            }
            const signer = this.getSigner(address).connect(this.provider);
            const unSignedTx = yield signer.populateTransaction(params[0]);
            const tx = yield signer.sendTransaction(unSignedTx);
            return tx.hash;
        });
    }
    eth_call(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.call(params[0]);
        });
    }
    eth_estimateGas(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params[1] && params[1] !== "latest") {
                throw Error(`estimateGas does not support blockTag[${params}]`);
            }
            const result = yield this.provider.estimateGas(params[0]);
            return (0, ethers_1.toQuantity)(result);
        });
    }
    eth_getBlockByHash(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.getBlock(params[0]);
        });
    }
    eth_getBlockByNumber(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eth_getBlockByHash(params);
        });
    }
    eth_getTransactionByHash(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.getTransaction(params[0]);
        });
    }
    eth_getTransactionReceipt(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.getTransactionReceipt(params[0]);
        });
    }
    eth_sign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
    personal_sign(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const signer = this.getSigner(params[1]);
            let message = params[0];
            if ((0, ethers_1.isHexString)(message)) {
                message = (0, ethers_1.getBytes)(message);
            }
            const signed = yield signer.signMessage(message);
            return signed;
        });
    }
    // wallet
    wallet_switchEthereumChain(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    wallet_addEthereumChain(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    metamask_getProviderState() {
        return __awaiter(this, void 0, void 0, function* () {
            const network = yield this.provider.getNetwork();
            const accounts = yield this.eth_requestAccounts();
            return {
                isUnlocked: true,
                chainId: (0, ethers_1.toQuantity)(network.chainId),
                networkVersion: (0, ethers_1.toQuantity)(network.chainId),
                accounts: accounts
            };
        });
    }
    metamask_sendDomainMetadata(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    net_listening(params) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    net_version(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = yield this.provider.getNetwork();
            return (0, ethers_1.toQuantity)(network.chainId);
        });
    }
    wallet_getPermissions(params) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    Call(method, params) {
        switch (method) {
            case 'wallet_getPermissions':
                return this.wallet_getPermissions(params);
            case 'net_listening':
                return this.net_listening(params);
            case 'net_version':
                return this.net_version(params);
            case 'metamask_sendDomainMetadata':
                return this.metamask_sendDomainMetadata(params);
            case 'metamask_getProviderState':
                return this.metamask_getProviderState();
            case 'wallet_switchEthereumChain':
                return this.wallet_switchEthereumChain(params);
            case 'wallet_addEthereumChain':
                return this.wallet_addEthereumChain(params);
            case 'eth_sign':
                return this.eth_sign(params);
            case 'personal_sign':
                return this.personal_sign(params);
            case 'eth_getTransactionReceipt':
                return this.eth_getTransactionReceipt(params);
            case 'eth_getTransactionByHash':
                return this.eth_getTransactionByHash(params);
            case 'eth_getBlockByNumber':
                return this.eth_getBlockByNumber(params);
            case 'eth_getBlockByHash':
                return this.eth_getBlockByHash(params);
            case 'eth_estimateGas':
                return this.eth_estimateGas(params);
            case 'eth_call':
                return this.eth_call(params);
            case 'eth_sendTransaction':
                return this.eth_sendTransaction(params);
            case 'eth_gasPrice':
                return this.eth_gasPrice();
            case 'eth_requestAccounts':
                return this.eth_requestAccounts();
            case 'eth_coinbase':
                return this.eth_coinbase();
            case 'eth_accounts':
                return this.eth_accounts();
            case 'eth_blockNumber':
                return this.eth_blockNumber();
            case 'eth_chainId':
                return this.eth_chainId();
            case 'eth_getBalance':
                return this.eth_getBalance(params);
            case 'eth_getStorageAt':
                return this.eth_getStorageAt(params);
            case 'eth_getTransactionCount':
                return this.eth_getTransactionCount(params);
            case 'eth_getBlockTransactionCountByHash':
                return this.eth_getBlockTransactionCountByHash(params);
            case 'eth_getBlockTransactionCountByNumber':
                return this.eth_getBlockTransactionCountByNumber(params);
            case 'eth_getCode':
                return this.eth_getCode(params);
            case 'eth_sendRawTransaction':
                return this.eth_sendRawTransaction(params);
        }
    }
}
exports.Service = Service;
