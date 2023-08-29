window.Role = {
    PROVIDER: 'metamask-provider',
    CONTENT_SCRIPT: 'metamask-contentscript',
    INPAGE: 'metamask-inpage',
    SUDAO_PROVIDER: 'sudao-provider',
    SUDAO_CONTENT_SCRIPT: 'sudao-contentscript'
};
window.addEventListener('message', (event) => {
    if (event.data.target == Role.CONTENT_SCRIPT) {
        const msg = event.data.data;
        if (msg == 'SYN' || msg == 'ACK') {
            window.postMessage({ target: Role.INPAGE, data: 'ACK' }, window.location.origin);
        }
        else {
            const data = JSON.stringify({
                target: Role.SUDAO_CONTENT_SCRIPT,
                data: {
                    name: Role.SUDAO_PROVIDER,
                    data: {
                        id: msg.data.id,
                        jsonrpc: '2.0',
                        pageid: window.sudao_page_id,
                        method: msg.data.method,
                        params: msg.data.params
                    }
                }
            });
            sendToServer(data);
        }
    }
});
window.postMessage({ target: Role.INPAGE, data: 'SYN' }, window.location.origin);
window.sendToServer = (msg) => {
    //通过console.log(msg)打印，利用cdp通信
    console.log(msg);
};
