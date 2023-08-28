import { BaseWallet, JsonRpcProvider, Provider, Wallet, getBytes, isHexString, toNumber, toQuantity } from "ethers";
import { Account, ChainInfo, IService } from "./define";

export class Service implements IService {
    accounts: Array<Account>
    provider: Provider
    chainInfo: ChainInfo

    constructor(accounts: Array<Account>, chainInfo: ChainInfo) {
        this.accounts = accounts
        this.chainInfo = chainInfo
        this.provider = new JsonRpcProvider(chainInfo.rpcUrl)
    }

    private getSigner(address: string): BaseWallet | undefined {
        for (const account of this.accounts) {
            if (account.address == address) {
                return new Wallet(account.key)
            }
        }
        return
    }

    changeAccounts(accounts: Array<Account>) {
        this.accounts = accounts
    }

    changeChain(chainInfo: ChainInfo) {
        this.chainInfo = chainInfo
        this.provider = new JsonRpcProvider(chainInfo.rpcUrl)
    }

    // eip1193
    async eth_gasPrice() {
        const feeData = await this.provider.getFeeData()
        return feeData.gasPrice!.toString(10)
    }

    async eth_requestAccounts() {
        const res = []
        for (const account of this.accounts) {
            res.push(account.address)
        }
        return res
    }

    async eth_coinbase() {
        return await this.eth_requestAccounts()
    }

    async eth_accounts() {
        return await this.eth_requestAccounts()
    }

    async eth_blockNumber() {
        return await this.provider.getBlockNumber()
    }

    async eth_chainId() {
        const result = await this.provider.getNetwork();
        return toQuantity(result.chainId);
    }

    async eth_getBalance(params: any) {
        const result = await this.provider.getBalance(params[0], params[1]);
        return toQuantity(result);
    }

    //todo
    async eth_getStorageAt(params: any) {
        return await this.provider.getStorage(params[0], params[1], params[2]);
    }

    async eth_getTransactionCount(params: any) {
        const result = await this.provider.getTransactionCount(params[0], params[1]);
        return toQuantity(result);
    }

    async eth_getBlockTransactionCountByHash(params: any) {
        const result = await this.provider.getBlock(params[0]);
        return toQuantity(result!.transactions.length);
    }
    async eth_getBlockTransactionCountByNumber(params: any) {
        return await this.eth_getBlockTransactionCountByHash(params)
    }

    async eth_getCode(params: any) {
        return await this.provider.getCode(params[0], params[1])
    }

    async eth_sendRawTransaction(params: any) {
        return await this.provider.broadcastTransaction(params[0]);
    }

    async eth_sendTransaction(params: any) {
        const address = params[0].from
        if (this.accounts.indexOf(address) < 0) {
            return
        }

        const signer = this.getSigner(address)!.connect(this.provider)

        const unSignedTx = await signer!.populateTransaction(params[0])
        const tx = await signer!.sendTransaction(unSignedTx!)

        return tx!.hash
    }

    async eth_call(params: any) {
        return await this.provider.call(params[0]);
    }

    async eth_estimateGas(params: any) {
        if (params[1] && params[1] !== "latest") {
            throw Error(`estimateGas does not support blockTag[${params}]`)
        }

        const result = await this.provider.estimateGas(params[0]);
        return toQuantity(result);
    }

    async eth_getBlockByHash(params: any) {
        return await this.provider.getBlock(params[0]);
    }

    async eth_getBlockByNumber(params: any) {
        return await this.eth_getBlockByHash(params)
    }

    async eth_getTransactionByHash(params: any) {

        return await this.provider.getTransaction(params[0])
    }
    async eth_getTransactionReceipt(params: any) {
        return await this.provider.getTransactionReceipt(params[0]);
    }

    async eth_sign(params: any): Promise<string> {
        return ''
    }

    async personal_sign(params: any): Promise<string> {
        const signer = this.getSigner(params[1])
        let message = params[0]
        if (isHexString(message)) {
            message = getBytes(message)
        }
        const signed = await signer.signMessage(message)
        return signed
    }

    // wallet
    async wallet_switchEthereumChain(params: any): Promise<undefined> {
        return undefined
    }
    async wallet_addEthereumChain(params: any): Promise<undefined> {
        return undefined
    }

    async metamask_getProviderState() {
        const network = await this.provider.getNetwork()
        const accounts = await this.eth_requestAccounts()
        return {
            isUnlocked: true,
            chainId: toQuantity(network.chainId),
            networkVersion: toQuantity(network.chainId),
            accounts: accounts
        }
    }

    async metamask_sendDomainMetadata(params: any) {
        return true
    }

    async net_listening(params: any) {
    }

    async net_version(params: any) {
        const network = await this.provider.getNetwork()
        return toQuantity(network.chainId)
    }

    async wallet_getPermissions(params: any) {
    }

    Call(method: string, params: any): any {
        switch (method) {
            case 'wallet_getPermissions':
                return this.wallet_getPermissions(params)
            case 'net_listening':
                return this.net_listening(params)
            case 'net_version':
                return this.net_version(params)
            case 'metamask_sendDomainMetadata':
                return this.metamask_sendDomainMetadata(params)
            case 'metamask_getProviderState':
                return this.metamask_getProviderState()
            case 'wallet_switchEthereumChain':
                return this.wallet_switchEthereumChain(params)
            case 'wallet_addEthereumChain':
                return this.wallet_addEthereumChain(params)
            case 'eth_sign':
                return this.eth_sign(params)
            case 'personal_sign':
                return this.personal_sign(params)
            case 'eth_getTransactionReceipt':
                return this.eth_getTransactionReceipt(params)
            case 'eth_getTransactionByHash':
                return this.eth_getTransactionByHash(params)
            case 'eth_getBlockByNumber':
                return this.eth_getBlockByNumber(params)
            case 'eth_getBlockByHash':
                return this.eth_getBlockByHash(params)
            case 'eth_estimateGas':
                return this.eth_estimateGas(params)
            case 'eth_call':
                return this.eth_call(params)
            case 'eth_sendTransaction':
                return this.eth_sendTransaction(params)
            case 'eth_gasPrice':
                return this.eth_gasPrice()
            case 'eth_requestAccounts':
                return this.eth_requestAccounts()
            case 'eth_coinbase':
                return this.eth_coinbase()
            case 'eth_accounts':
                return this.eth_accounts()
            case 'eth_blockNumber':
                return this.eth_blockNumber()
            case 'eth_chainId':
                return this.eth_chainId()
            case 'eth_getBalance':
                return this.eth_getBalance(params)
            case 'eth_getStorageAt':
                return this.eth_getStorageAt(params)
            case 'eth_getTransactionCount':
                return this.eth_getTransactionCount(params)
            case 'eth_getBlockTransactionCountByHash':
                return this.eth_getBlockTransactionCountByHash(params)
            case 'eth_getBlockTransactionCountByNumber':
                return this.eth_getBlockTransactionCountByNumber(params)
            case 'eth_getCode':
                return this.eth_getCode(params)
            case 'eth_sendRawTransaction':
                return this.eth_sendRawTransaction(params)
        }
    }
}