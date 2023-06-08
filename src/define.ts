import { Block, HDNodeWallet, TransactionReceipt, TransactionResponse, getIndexedAccountPath } from "ethers"

export const Role = {
    PROVIDER: 'metamask-provider',
    CONTENT_SCRIPT: 'metamask-contentscript',
    INPAGE: 'metamask-inpage',

    SUDAO_PROVIDER: 'sudao-provider',
    SUDAO_CONTENT_SCRIPT: 'sudao-contentscript'
}

export interface Account {
    address: string,
    key: string
}

export interface ChainInfo {
    name: string,
    id: number,
    rpcUrl: string,
    blockExplorers: string
}

export interface Response {
    target: string,
    data: {
        name: string,
        data: {
            jsonrpc: string,
            id: number,
            result: any
        }
    }
}

export interface Request {
    target: string,
    data: {
        name: string,
        data: {
            method: string,
            params: any
        }
    }
}

export interface IService {
    // eip1193
    eth_gasPrice(): Promise<string>,

    eth_requestAccounts(): Promise<string[]>,

    eth_accounts(): Promise<string[]>,

    eth_blockNumber(): Promise<number>,

    eth_chainId(): Promise<string>,

    eth_getBalance(params: any): Promise<string>,

    //todo
    eth_getStorageAt(params: any): Promise<string>,

    eth_getTransactionCount(params: any): Promise<string>,

    eth_getBlockTransactionCountByHash(params: any): Promise<string>,
    eth_getBlockTransactionCountByNumber(params: any): Promise<string>,


    eth_getCode(params: any): Promise<string>,

    eth_sendRawTransaction(params: any): Promise<TransactionResponse>,
    eth_sendTransaction(params: any): Promise<string>,

    eth_call(params: any): Promise<string>,

    eth_estimateGas(params: any): Promise<string>,

    eth_getBlockByHash(params: any): Promise<null | Block>,

    eth_getBlockByNumber(params: any): Promise<null | Block>,

    eth_getTransactionByHash(params: any): Promise<null | TransactionResponse>,
    eth_getTransactionReceipt(params: any): Promise<null | TransactionReceipt>,

    eth_sign(params: any): Promise<string>,

    // wallet
    wallet_switchEthereumChain(params: any): Promise<undefined>,

    metamask_getProviderState(): Promise<any>,

    metamask_sendDomainMetadata(params: any): Promise<boolean>

    net_listening(params: any): any,

    wallet_getPermissions(params: any): any,
}
export const deriveHD = (key: string, n: number) => {
    const accounts: Account[] = []
    for (let i = 0; i < n; i++) {
        const w = HDNodeWallet.fromPhrase(key, undefined, getIndexedAccountPath(i))
        accounts.push({
            address: w.address,
            key: w.privateKey
        })
    }
    return accounts
}

export function newResponse(id: number, result: any): Response {
    return {
        target: Role.INPAGE,
        data: {
            name: Role.PROVIDER,
            data: {
                jsonrpc: '2.0',
                id: id,
                result: result
            }
        }
    }
}


export function newRequest(method: string, params: any): Request {
    return {
        target: Role.INPAGE,
        data: {
            name: Role.PROVIDER,
            data: {
                method: method,
                params: params
            }
        }
    }
}