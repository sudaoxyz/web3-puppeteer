import axios from 'axios'

const baseURL = 'http://127.0.0.1:54345'

const request = axios.create({
    baseURL,
    timeout: 0
})

request.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data
        } else {
            console.log('请求失败，检查网络')
        }
    },
    error => {
        console.error('请求失败了')
        return Promise.reject(error)
    }
)

/**
 * @description 打开浏览器并返回wspoint
 * @returns {Promise<Object>} Promise<any>
 * @param {Object} data
 * @param {String} data.id 窗口id
 * @param {Array} data.args 启动附加参数，数组类型，比如 ["--headless"]
 * @param {Boolean} data.loadExtensions 是否加载扩展
 * @param {Boolean} data.extractIp 是否尝试提取IP
 */
function openBrowser(data) {
    return request({ method: 'post', url: '/browser/open', data })
}

/**
 * @description 关闭浏览器
 * @param {String} id
 * @returns {Promise}
 */
function closeBrowser(id) {
    return request({ method: 'post', url: '/browser/close', data: { id } })
}

/**
 * @description 创建/修改浏览器，传id是修改，不传id是创建
 * @param {Object} data
 * @returns {Promise}
 */
function updateBrowser(data) {
    return request({ method: 'post', url: '/browser/update', data })
}
/**
 * @description 修改browser信息，只修改传入的配置
 * @param {Object} data 参考创建配置项
 * @returns {Promise}
 */
function updatepartial(data) {
    return request({ method: 'post', url: '/browser/update/partial', data })
}
/**
 * @description 批量删除浏览器
 * @param {array} ids
 */
function deleteBatchBrowser(ids) {
    return request({ method: 'post', url: '/browser/delete/ids', data: { ids } })
}

/**
 * @description 删除浏览器
 * @param {String} id
 * @returns {Promise}
 */
function deleteBrowser(id) {
    return request({ method: 'post', url: '/browser/delete', data: { id } })
}

/**
 * @description 获取浏览器详情
 * @param {String} id
 * @returns {Promise}
 * */
function getBrowserDetail(id) {
    return request({ method: 'post', url: '/browser/detail', data: { id } })
}

/**
 * @description 获取浏览器列表
 * @param {Object} data
 * @param {Number} data.page // 必传
 * @param {Number} data.pageSize // 必传
 * @param {String} data.groupId // 分组ID，非必传
 * @param {String} data.name // 窗口名称，用于模糊查询，非必传
 * @param {String} data.sortProperties // 排序参数，默认序号，seq，非必传
 * @param {String} data.sortDirection // 排序顺序参数，默认desc，可传asc，非必传
 * @returns {Promise}
 * */
function getBrowserList(data) {
    return request({ method: 'post', url: '/browser/list', data })
}
/**
 * @description 获取浏览器列表（简洁）
 */
function getBrowserConciseList(data) {
    return request({ method: 'post', url: '/browser/list/concise', data })
}
/**
 * @description 分组list
 * @param {Number} page 从0开始
 * @param {Number} pageSize 例如10
 * @returns {Promise}
 * */
function getGroupList(page, pageSize) {
    return request({ method: 'post', url: '/group/list', data: { page, pageSize } })
}

/**
 * @description 添加分组
 * @param {String} groupName
 * @param {Number} sortNum
 * @returns {Promise}
 * */
function addGroup(groupName, sortNum) {
    return request({ method: 'post', url: '/group/add', data: { groupName, sortNum } })
}

/**
 * @description 修改分组
 * @param {String} id
 * @param {String} groupName
 * @param {Number} sortNum
 * @returns {Promise}
 * */
function editGroup(id, groupName, sortNum) {
    return request({ method: 'post', url: '/group/edit', data: { id, groupName, sortNum } })
}

/**
 * @description 删除分组
 * @param {String} id
 * @returns {Promise}
 * */
function deleteGroup(id) {
    return request({ method: 'post', url: '/group/delete', data: { id } })
}

/**
 * @description 分组详情
 * @param {String} id
 * */
function getGroupDetail(id) {
    return request({ method: 'post', url: '/group/detail', data: { id } })
}

/**
 * @description 获取指定窗口的pids
 * @param {Array} ids 
 * @returns 
 */
function getPids(ids) {
    return request({ url: '/browser/pids', method: 'post', data: { ids } })
}
/**
 * @description 获取活着窗口的pids
 * @param {Array} ids 
 * @returns 
 */
function getAlivePids(ids) {
    return request({ url: '/browser/pids/alive', method: 'post', data: { ids } })
}
/**
 * @description 获取所有活着窗口的pids
 * @returns 
 */
function getAliveBrowsersPids() {
    return request({ url: '/browser/pids/all', method: 'post' })
}

/**
 * @description 批量修改窗口备注
 * @param {String} remark
 * @param {Array} browserIds
 * @returns 
 */
function updateBrowserMemark(remark, browserIds) {
    return request({ url: '/browser/remark/update', method: 'post', data: { remark, browserIds } })
}
/**
 * @description 批量修改窗口分组 
 * @param {Object} data
 * @param {Number} data.groupId
 * @param {Array} data.browserIds
 */
function batchUpdateBrowserGroup(data) {
    return request({ url: '/browser/group/update', method: 'post', data })
}
/**
 * @description 通过序号批量关闭浏览器
 * 
 */
function closeBrowsersBySeqs(seqs) {
    return request({ url: '/browser/close/byseqs', method: 'post', data: { seqs } })
}
/**
 * @description 批量修改代理
 * @param {Object} data
 * @param {Number} data.proxyMethod //代理类型，2自定义代理，3提取IP
 * @param {String} data.proxyType // 自定义代理类型
 */
function batchUpdateProxy(data) {
    return request({ url: '/browser/proxy/update', method: 'post', data })
}

export default {
    openBrowser,
    closeBrowser,
    updateBrowser,
    deleteBrowser,
    getBrowserDetail,
    addGroup,
    editGroup,
    deleteGroup,
    getGroupDetail,
    getGroupList,
    getBrowserList,
    getPids,
    updatepartial,
    updateBrowserMemark,
    deleteBatchBrowser,
    getBrowserConciseList,
    getAlivePids,
    getAliveBrowsersPids,
    batchUpdateBrowserGroup,
    closeBrowsersBySeqs,
    batchUpdateProxy,
    request
}