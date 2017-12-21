import fetch from '@/utils/fetch'

/**
 * author:chn
 * 首页展示信息
 * @param {*} query
 */
export function fetchSmsIndex(query) {
  return fetch({
    url: '/sms/index',
    method: 'get',
    params: query
  })
}
/** ************** 任务管理start *******************/
/**
 * 新增普通任务：2.1.1
 * @param {*新增普通任务：2.1.1} query
 */
export function addPushTask(query) {
  return fetch({
    url: '/sms/marketTask',
    method: 'post',
    params: query
  })
}
/**
 * 新增api任务接口：2.1.2
 * @param {*} query
 */
export function addApiTask(query) {
  return fetch({
    url: '/sms/apiTask',
    method: 'post',
    params: query
  })
}
/**
 * 根据Id查询任务详情接口：2.1.3
 * @param {*} query
 */
export function queryPushTaskById(query) {
  return fetch({
    url: '/sms/taskDetail',
    method: 'get',
    params: query
  })
}
/**
 * 短信任务列表查询接口对应接口文档2.1.4
 */
export function queryPushTaskList(query) {
  return fetch({
    url: '/sms/task',
    method: 'get',
    params: query
  })
}
/**
 * 根据id弃用任务接口：2.1.5
 * @param {*} query
 */
export function delMsgPush(query) {
  return fetch({
    url: '/sms/task',
    method: 'delete',
    params: query
  })
}

/**
 * 根据任务Id分页查询接口 2.1.19
 * @param {*} query
 */
export function queryLogById(query) {
  return fetch({
    url: '/sms/record',
    method: 'get',
    params: query
  })
}
/**
 * 根据任务Id导出接口 2.1.20
 * @param {*} query
 */
export function exportTast(query) {
  return fetch({
    url: '/sms/record/export',
    method: 'get',
    params: query
  })
}
/** ************** 任务管理end *******************/

/** ************** 基础信息start *******************/

/**
 * author: Fiona
 * content: 短信签名
 */

// 查询-F
export function fetchSignatures(query) {
  return fetch({
    url: '/sms/signatures',
    method: 'get',
    params: query
  })
}
// 新增列表-F
export function fetchAddSignature(query) {
  return fetch({
    url: '/sms/signatures/add',
    method: 'post',
    params: query
  })
}
// 删除-F
export function fetchDelSignatures(query) {
  return fetch({
    url: '/sms/signatures/delete',
    method: 'delete',
    params: query
  })
}

// 签名应用任务列表-F
export function fetchUsedTasks(query) {
  return fetch({
    url: '/sms/tasks',
    method: 'post',
    params: query
  })
}

/**
 * author: Fiona
 * content: 短信通道
 */
// 查询列表-F
export function fetchChannels(query) {
  return fetch({
    url: '/sms/channels',
    method: 'get',
    params: query
  })
}
// 修改-F
export function fetchUpdateChannel(query) {
  return fetch({
    url: '/sms/channels/update',
    method: 'put',
    params: query
  })
}

/** ************** 基础信息end *******************/

// 推送任务管理  分页条件查询接口（推送日志）-sll
export function fetchMsgPushList(query) {
  return fetch({
    url: '/sms/task',
    method: 'get',
    params: query
  })
}
// 推送任务管理  批量弃用接口 -sll
export function fetchDelMsgPush(query) {
  return fetch({
    url: '/sms/task/delete',
    method: 'delete',
    params: query
  })
}

/**
 * author:wuqiang
 * 推送日志
 * @param {*} query
 */
// 短信任务分页查询接口-wuqiang
export function fetchPropelList(query) {
  return fetch({
    url: '/sms/sysMgr/usrdiv',
    method: 'get',
    params: query
  })
}
/**
 * author:YYQ
 * 短信模板
 * @param {*} query
 */
// 获取短信模板列表mock接口-YYQ
export function fetchSmsTmplList(query) {
  return fetch({
    url: '/sms/templates',
    method: 'get',
    params: query
  })
}
// 删除短信模板接口-YYQ
export function fetchDelSmsTmpl(query) {
  return fetch({
    url: '/sms/templates/delete',
    method: 'delete',
    params: query
  })
}
// 更新短信模板接口-YYQ
export function fetchUpdateSmeTmpl(data) {
  return fetch({
    url: '/sms/templates',
    method: 'put',
    params: data
  })
}
// 新增短信模板接口-YYQ
export function fetchAddSmeTmpl(data) {
  return fetch({
    url: '/sms/templates',
    method: 'post',
    params: data
  })
}
// 2.1.23	根据短信模板id列表查询待执行和正在执行的任务 -YYQ
export function fetchQuerySmsTmplTask(query) {
  return fetch({
    url: '/sms/tasks',
    method: 'get',
    params: query
  })
}

/**
 * author:wuqiang
 * 推送日志
 * @param {*} query
 */
// 根据任务ID查询任务详情接口-wuqiang
export function fetchDetailList(query) {
  return fetch({
    url: '/sms/sysMgr/usrdiv/taskDetail',
    method: 'get'
  })
}

// 获取系统设置 wh
export function systemGetList(query) {
  return fetch({
    url: '/system/settings/',
    method: 'get',
    params: query
  })
}
// 查询短信发送的数目接口 --shaolingling
export function fetchStatistics(query) {
  return fetch({
    url: '/sms/numbers',
    method: 'get',
    params: query
  })
}
// 更新系统设置 wh
export function systemUpdate(data) {
  return fetch({
    url: '/system/settings/',
    method: 'put',
    params: data
  })
}

// 获取用户设置 wh
export function userGetList(query) {
  return fetch({
    url: '/system/users/',
    method: 'get',
    params: query
  })
}
// 更新用户设置 wh
export function userUpdate(data) {
  return fetch({
    url: '/system/users/',
    method: 'put',
    params: data
  })
}

// 获取角色设置 wh
export function roleFetchList(query) {
  return fetch({
    url: '/system/role/',
    method: 'get',
    params: query
  })
}
// 更新角色设置 wh
export function roleUpdate(data) {
  return fetch({
    url: '/system/role/',
    method: 'put',
    params: data
  })
}

// 申请角色编号 wh
export function roleNewRoleCode(data) {
  return fetch({
    url: '/system/role/newRoleCode/',
    method: 'get',
    params: data
  })
}

// 创建角色 wh
export function roleCreate(data) {
  return fetch({
    url: '/system/role/',
    method: 'put',
    params: data
  })
}

// 删除角色 wh
export function roleDelete(data) {
  return fetch({
    url: '/system/role/',
    method: 'delete',
    params: data
  })
}
