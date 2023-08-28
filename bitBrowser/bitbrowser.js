import api from './bitapi.js'
import puppeteer from 'puppeteer-core'

export const openBrowser = async (id) => {
    try {
        const res = await api.openBrowser({
            id,
            args: [],
            loadExtensions: false,
            extractIp: false
        })
        return res
    } catch (err) {
        throw err
    }
}

export const closeBrowser = async (id) => {
    const res = await api.closeBrowser(id)
    if (res.success) {
        console.log('关闭浏览器成功:', id)
    }
}

export const connectBrowser = async (res, browserId) => {
    if (!res.success) {
        throw new Error('浏览器打开失败:', browserId)
    }

    let wsEndpoint = res.data.ws
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
            defaultViewport: null
        })
        return browser
    } catch (err) {
        throw err
    }
}