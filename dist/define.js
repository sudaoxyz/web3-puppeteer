"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRequest = exports.newResponse = exports.deriveHD = exports.Role = void 0;
const ethers_1 = require("ethers");
exports.Role = {
    PROVIDER: 'metamask-provider',
    CONTENT_SCRIPT: 'metamask-contentscript',
    INPAGE: 'metamask-inpage',
    SUDAO_PROVIDER: 'sudao-provider',
    SUDAO_CONTENT_SCRIPT: 'sudao-contentscript'
};
const deriveHD = (key, n) => {
    const accounts = [];
    for (let i = 0; i < n; i++) {
        const w = ethers_1.HDNodeWallet.fromPhrase(key, undefined, (0, ethers_1.getIndexedAccountPath)(i));
        accounts.push({
            address: w.address,
            key: w.privateKey
        });
    }
    return accounts;
};
exports.deriveHD = deriveHD;
function newResponse(id, result) {
    return {
        target: exports.Role.INPAGE,
        data: {
            name: exports.Role.PROVIDER,
            data: {
                jsonrpc: '2.0',
                id: id,
                result: result
            }
        }
    };
}
exports.newResponse = newResponse;
function newRequest(method, params) {
    return {
        target: exports.Role.INPAGE,
        data: {
            name: exports.Role.PROVIDER,
            data: {
                method: method,
                params: params
            }
        }
    };
}
exports.newRequest = newRequest;
