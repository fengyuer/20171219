import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { queryLists } from './CRUD.js'
import _ from 'lodash'
/** ************** 首页 *******************/
/**
 * author:chn
 * 首页信息展示mock数据
 */
const smsIndex = Mock.mock({
  id: '@guid',
  avatar: '@image("104x104","#02adea","#FFF","gif","ucs")',
  name: '@cname',
  'depart|1': ['研究院', '云群', '百视通'],
  'role|1': ['业务员'],
  totalMsgCount: '@integer(0,200)', //
  lastCount: '@integer(0,200)',
  lastTimeStamp: '@datetime("yyyy-MM-dd  HH:mm:ss")',
  totalArrivalSucc: '@integer(0,100)',
  totalArrivalFail: '@integer(0,100)',
  reqFail: '@integer(1,1000)'
})
/** ************** 短信任务 *******************/

// 短信任务数据mock
const msgPushList = []
// 详情的缓存
// const msgPushDetails = []
const msgPushCount = Mock.mock('@integer(0,100)')
for (let i = 0; i < msgPushCount; i++) {
  msgPushList.push(
    Mock.mock({
      'taskType|1': ['普通任务', 'api任务'],
      executeTime: Date.now() + Mock.mock('@integer(-1000000000,1000000000)'),
      id: '@id',
      sendUserNum: '@integer(0, 1000)',
      sendNum: '@integer(0, 1000)',
      createTime: Date.now() + Mock.mock('@integer(-1000000000,1000000000)'), // （申请时间）
      templateContent: '模板内容',
      'channelName|1': ['通道1', '通道2'],
      'creater|1': ['创建人1', '创建人2'],
      templateName: '@ctitle',
      'department|1': ['研究院', '云群', '百视通'],
      'status|1': [1, 2, 3, 4, 5, 6],
      'signName|1': ['签名1', '签名2'],
      group: '东方购物游戏爱好者',
      isDel: false, // 是否弃用
      'description|1': ['推送说明1', '推送说明2'],
      checkDescription: '审核说明',
      'hasPushLog|1': [true, false]  // （”推送日志是否存在”）
    })
  )
}

/**
 * 新增普通任务 1
 * author:chn
 */
export function addPushTask(config) {
  const { signId, templateId, department, creater, description, executeTime } = param2Obj(config.body)
  if (!(signId && templateId && executeTime)) {
    return {
      'code': '000002',
      'message': '失败',
      'data': {
      }
    }
  }
  const newTask = Mock.mock({
    // 人群id TODO
    // 人群信息
    id: '@id',
    signId: signId,
    templateId: templateId,
    executeTime: executeTime,
    description: description,
    sendUserNum: '@integer(0, 1000)',
    sendNum: '@integer(0, 1000)',
    'creater': creater,
    templateName: '@ctitle',
    'department|1': ['研究院', '云群', '百视通'],
    'status|1': [1, 2, 3, 4, 5],
    'signName|1': ['签名1', '签名2'],
    group: '东方购物游戏爱好者'
  })
  msgPushList.unshift(newTask)
  return {
    'code': '000000',
    'message': '成功',
    'data': {
    }
  }
}
/**
 *新增api任务 2
 * author:chn
 */
export function addApiTask(config) {
  const { signId, templateId, creater, description } = param2Obj(config.body)
  if (!(signId && templateId)) {
    return {
      'code': '000002',
      'message': '失败',
      'data': {
      }
    }
  }
  const newTask = Mock.mock({
    // 人群id
    // 人群信息
    id: '@id',
    signId: signId,
    templateId: templateId,
    sendUserNum: '@integer(0, 1000)',
    sendNum: '@integer(0, 1000)',
    'creater': creater,
    description: description,
    templateName: '@ctitle',
    'department|1': ['研究院', '云群', '百视通'],
    'status|1': [1, 2, 3, 4, 5],
    'signName|1': ['签名1', '签名2'],
    group: '东方购物游戏爱好者'
  })
  msgPushList.unshift(newTask)
  return {
    'code': '000000',
    'message': '成功',
    'data': {
    }
  }
}
/**
 * 根据任务id查询任务详情 3
 * author:chn
 * @param {*} config
 */
export function queryPushTaskById(config) {
  const { id } = param2Obj(config.url)
  if (!id) {
    return {
      'code': '000002',
      'message': '失败',
      'data': {
      }
    }
  }
  let rst = queryLists({ id }, msgPushList)
  if (rst) {
    rst = _.cloneDeep(rst)
  }
  console.log(rst)
  return {
    'code': '000000',
    'message': '成功',
    'data': rst[0]
  }
}
/**
 * 推送任务列表查询接口 分页条件查询接口 4
 * author:chn
 * @param {*} config
 */
export function queryPushTaskList(config) {
  const urlObj = param2Obj(config.url)
  const { id, department, templateName, creater, startTime, endTime } = param2Obj(config.url)
  const status = parseInt(param2Obj(config.url).status)
  let searchList = _.cloneDeep(queryLists({ id, department, status, templateName, creater }, msgPushList))
  if (startTime) {
    searchList = searchList.filter((item) => {
      return item.executeTime >= startTime
    })
  }
  if (endTime) {
    searchList = searchList.filter((item) => {
      return item.executeTime <= endTime
    })
  }
  const pageList = searchList.slice((urlObj.pageNum - 1) * urlObj.pageSize, urlObj.pageNum * urlObj.pageSize)
  return Mock.mock({
    code: '000000',
    message: '成功',
    data: {
      currentPage: urlObj.pageNum,
      pageSize: urlObj.pageSize,
      recordsTotal: searchList.length,
      data: parseInt(urlObj.pagination) ? searchList : pageList
    }
  })
}
/**
 * 推送任务管理 批量弃用接口 5
 * author:chn
 * @param {*} config
 */
function delMsgPush(config) {
  const urlObj = param2Obj(config.url)
  const ids = urlObj.ids
  const idList = ids.split(',')
  for (let i = 0; i < idList.length; i++) {
    for (let j = 0; j < msgPushCount; j++) {
      if (msgPushList[j].id === idList[i]) {
        msgPushList[j].status = 6 // isDel 是否弃用
      }
    }
  }
  return Mock.mock({
    'code': '000000',
    'message': '成功'
  })
}

/** ----------------推送日志查询---------------- **/

/**
 * author:wuqiang
 * 推送日志mock数据
 */
const pushLogList = []
const pushLogCount = Mock.mock('@integer(0,100)')
for (let i = 0; i < pushLogCount; i++) {
  pushLogList.push(Mock.mock({
    number: '@increment',
    id: '@integer(1, 9)',
    phoneNo: '@integer(11111111111,19999999999)',
    sendStatus: 2,
    templateName: '@ctitle(3, 8)',
    'channelName': '短信通道',
    'sendTime': 1512380000000, // （发送时间）
    'receiveTime': 1512380000000, // （接收时间）
    'failureReason': 1512380000000 // （失败原因）
  }))
}
/**
 * 根据任务Id分页查询接口 19
 * @param {*} query
 */
export function queryLogById(config) {
  const urlObj = param2Obj(config.url)
  const { taskId } = param2Obj(config.url)
  const searchList = _.cloneDeep(queryLists({ taskId }, pushLogList))
  const pageList = searchList.slice((urlObj.pageNum - 1) * urlObj.pageSize, urlObj.pageSize)
  return Mock.mock({
    code: '000000',
    message: '成功',
    data: {
      'start': 0,
      'pageSize': 1,
      'currentPage': 1,
      'recordsTotal': 27474,
      data: pageList,
      'draw': null,
      'recordsFiltered': 27474,
      'pages': 27474,
      'pageNum': 1,
      'startRow': 0,
      'endRow': 0,
      'startIndex': 0
    }
  })
}
/**
 * 根据任务Id导出接口 20
 * @param {*} query
 */
export function exportTast(config) {
  const { taskId } = param2Obj(config.url)
  if (!taskId) {
    return {
      'code': '000001',
      'message': '失败',
      'data': {
        'url': 'url（s3地址）'
      }
    }
  }
  return {
    'code': '000000',
    'message': '成功',
    'data': {
      'url': '@url'// url（s3地址）
    }
  }
}

// /**
// * author:wuqiang
// * updater:chn
// * 推送日志mock数据
// * 就是任务列表，这个可以不用的
// */
// export function queryPushLog(config) {
//   // const urlObj = param2Obj(config.url)
//   const { taskID, creater, smsTemplet, phoneNum, sendState, page = 1, limit = 20 } = param2Obj(config.url)
//   const searchList = _.cloneDeep(queryLists({ taskID, sendState, status, phoneNum, smsTemplet, creater }, msgPushList))
//   const pageList = searchList.slice((page - 1) * limit, limit)
//   return {
//     total: searchList.length,
//     items: pageList
//   }
// }
// /**
// * author:wuqiang
// * update:chn
// * 根据任务ID查询日志列表
// */
// export function queryLoglistById(config) {
//   const { phoneNum, sendState, page = 1, limit = 20, sort } = param2Obj(config.url)
//   const searchList = _.cloneDeep(queryLists({ phoneNum, sendState }, msgPushList))
//   const pageList = searchList.slice((page - 1) * limit, limit)

//   return {
//     total: searchList.length,
//     items: pageList
//   }
// }
/** ************** 短信模板 *******************/

// 短信模板列表删除
function delSmsTmpl(objString) {
  // indexArr = {url: "https://api-dev/sms/templates/delete?id=0", type: "DELETE", body: null}
  const urlObj = param2Obj(objString.url)
  const idList = urlObj.id
  const idArr = idList.split(',')
  if (smsTmplList.length > 0) {
    for (let i = 0; i < idArr.length; i++) {
      for (let j = 0; j < smsTmplList.length; j++) {
        if (smsTmplList[j].id === idArr[i]) {
          smsTmplList.splice(j, 1)
          j = j - 1
        }
      }
    }
  }
}

/** ************** 基础信息 *******************/
/**
 * author: Fiona
 * content: 短信签名数据查询
 */
// 短信签名总数据
var signatureList = []
const signatures = function() {
  if (signatureList.length > 0) {
    return signatureList
  }
  const count = Mock.mock('@natural(1,10)')
  for (let i = 0; i < count; i++) {
    const data = Mock.mock({
      'id|+1': `SG${'@natural(001,1000)'}`,
      'name': '@first',
      'channelName': '@last',
      'creater': '@cname',
      'isActive': '@boolean',
      'createTime': '@datetime',
      'description': '@csentence(4,8)'
    })
    signatureList.push(data)
  }
  return signatureList
}
// 短信签名查询数据
function getSignatures(template) {
  let { queryKey, pageSize, curPage } = param2Obj(template.url)
  let checkData = []
  const filterObj = searchObj => Obj => {
    if (Obj.id.includes(searchObj)) {
      return Obj.id.includes(searchObj)
    }
    if (Obj.name.includes(searchObj)) {
      return Obj.name.includes(searchObj)
    }
  }

  // 获取总数据
  signatures()

  // 查询的总数据
  queryKey = queryKey || ''
  checkData = signatureList.filter(filterObj(queryKey))

  // 分页
  pageSize = pageSize || 5
  curPage = curPage || 1
  const total = Number(checkData.length)
  const totalPage = total % pageSize === 0 ? parseInt(total / pageSize) : parseInt(total / pageSize) + 1

  const perPageData = function() {
    const pageDataList = []
    for (let i = 0; i < totalPage; i++) {
      pageDataList.push(signatureList.splice(0, pageSize))
    }
    return pageDataList
  }

  return {
    code: '000000',
    message: '成功',
    data: {
      curPage,
      pageSize,
      total,
      totalPage,
      signaturesList: perPageData()[Number(curPage - 1)] || null
    }
  }
}

/** ************** 数据统计 *******************/
// 查询短信模板
// 查询短信签名
// 查询短信通道
// 创建人查询
// 条件查询统计结果
const queryStatistics = function(config) {

}
/**
 * author:sll
 */
// 短信发送数据mock
const sendList = []
const sendCount = Mock.mock('@integer(0,100)')
for (let i = 0; i < sendCount; i++) {
  sendList.push(
    Mock.mock({
      'department|1': ['研究院', '云群', '百视通'],
      creater: '@cname',
      'templateName|1': ['模板1', '模板1'],
      signName: ['签名1', '签名2'],
      channelName: ['通道1', '通道2'],
      sendStatus: [2, 3], // （2表示发送成功，3表示发送失败）
      receiveStatus: [2, 3], // （2表示接受成功，3表示接受失败）
      executeTime: Date.now() + Mock.mock('@integer(-1000000000,1000000000)')
    })
  )
}
// 根据颗粒度对查询结果分组
// function groupBy(searchList, granularity) {
//   searchList.array.forEach(function(item) {
//     let executeTime = new Date(item.executeTime)
//     switch (granularity) { // 颗粒度 小时-1 日-2 周-3 月-4
//     //  case 1: executeTime ; break;
//       case 2: executeTime.getDate(); break;
//       case 3:  ; break;
//       case 4:  ; break;

//   }
//     item.executeTime
//   })
// }
// 查询短信发送的数目接口 mock
function getSendCount(config) {
  const {
    department,
    creater,
    startTime,
    endTime,
    templateName,
    signName,
    channelName
  } = param2Obj(config.url)
  const searchList = sendList.filter(item => {
    if (department && item.department !== department) return false
    if (creater && item.creater !== creater) return false
    if (startTime && item.executeTime < startTime) return false
    if (endTime && item.executeTime > endTime) return false
    if (templateName && item.templateName !== templateName) return false
    if (signName && item.signName !== signName) return false
    if (channelName && item.channelName !== channelName) return false
    return true
  })
  const granularity = parseInt(param2Obj(config.url).granularity) // 颗粒度 小时-1 日-2 周-3 月-4
  groupBy(searchList, granularity)
}

/** ************** 任务审核 *******************/
/** ************** 系统管理 *******************/
// 系统管理 wuhui
function responseMockData(data = {}) {
  return {
    code: '000000',
    message: 'success',
    data: data
  }
}
//    查询系统设置接口
var smsSystemList = []
function systemGetList(config) {
  if (smsSystemList.length === 0) {
    const systemDataCount = 1
    for (let i = 0; i < systemDataCount; i++) {
      smsSystemList.push(
        Mock.mock({
          id: '@increment',
          'approveEnable|1': ['on', 'off'],
          'proposerEnble|1': ['on', 'off']
        })
      )
    }
  }
  const { approveEnable, proposerEnble, start = 1, pageSize = 20 } = param2Obj(
    config.url
  )
  console.log(start)
  const mockList = smsSystemList.filter(item => {
    if (approveEnable && item.approveEnable !== approveEnable) return false
    if (proposerEnble && item.proposerEnble !== proposerEnble) return false
    console.log(
      'approveEnable:' +
        item.approveEnable +
        '; proposerEnble:' +
        item.proposerEnble
    )
    return true
  })
  const pageList = mockList.filter(
    (item, index) => index < pageSize * start && index >= pageSize * (start - 1)
  )
  return responseMockData({
    total: mockList.length,
    items: pageList
  })
}

// 更新系统设置接口
function systemUpdate(config) {
  // systemUpdate: (config => {
  console.log('------update systemSettings data:------' + config.body)
  return responseMockData({})
}

// 用户管理 wh
// 条件分页查询用户列表接口
// 根据id查询用户详情接口
var userList = []
const userDataCount = 6
function userGetList(config) {
  if (userList.length === 0) {
    for (let i = 0; i < userDataCount; i++) {
      userList.push(
        Mock.mock({
          id: '@increment',
          account: Mock.mock('@EMAIL()'),
          assignedRole: ['业务人员', '系统管理员', '短信推送员'],
          timestamp: +Mock.Random.date('T')
        })
      )
    }
  }
  const { account, start = 1, pageSize = 20 } = param2Obj(config.url)
  const mockList = userList.filter(item => {
    if (account && item.account !== account) return false
    return true
  })
  const pageList = mockList.filter(
    (item, index) => index < pageSize * start && index >= pageSize * (start - 1)
  )
  return responseMockData({
    total: mockList.length,
    items: pageList
  })
}
// 根据id更新用户详情接口 wh
function userUpdate(config) {
  console.log('------update mock data user Mgr222:------' + config.body)
  return responseMockData()
}

// 角色管理
// 条件分页查询角色列表接口 wh
// 根据id查询角色详情接口 wh
// 查询权限树接口
var roleList = []
const roleDataCount = 6
function roleGetList(config) {
  if (roleList.length === 0) {
    for (let i = 0; i < roleDataCount; i++) {
      roleList.push(
        Mock.mock({
          id: '@increment',
          roleCode: 'R' + '@integer(100000, 300000)',
          'roleName|1': ['普通管理员', '业务领导', '短信推送员'],
          timestamp: +Mock.Random.date('T'),
          account: Mock.mock('@EMAIL()'),
          roleDescribe: '@ctitle(15)',
          roleAuthority: [1, 3, 5],
          'status|1': ['on', 'off']
        })
      )
    }
  }
  const {
    roleCode,
    roleName,
    dateRangeStart,
    dateRangeEnd,
    start = 1,
    pageSize = 20
  } = param2Obj(config.url)
  console.log(config.url)
  const mockList = roleList.filter(item => {
    if (
      dateRangeStart &&
      dateRangeEnd &&
      (item.timestamp < dateRangeStart || item.timestamp > dateRangeEnd)
    ) {
      return false
    }

    if (roleCode && item.roleCode !== roleCode) return false
    if (roleName && item.roleName.indexOf(roleName) < 0) return false
    return true
  })

  const pageList = mockList.filter(
    (item, index) => index < pageSize * start && index >= pageSize * (start - 1)
  )
  return responseMockData({
    total: mockList.length,
    items: pageList
  })
}
// 根据id更新角色信息接口 wh
// 批量启用/停用接口
function roleUpdate(config) {
  console.log('update role data:' + config.body)
  return responseMockData()
}
// 新增角色接口 wh
function roleCreate(config) {
  console.log('create role data:' + config.body)
  return responseMockData()
}
//　申请角色码编号
function roleNewCode() {
  console.log(
    '----mock get new Role Code SN or creatorAccount-----xxx@opg.cn-----'
  )
  return responseMockData({
    roleCode: 'R99999990',
    account: 'xxx@opg.cn',
    id: '100011'
  })
}
// 批量删除角色接口
function roleDelete(roles) {
  console.log(roles.url)
  console.log('------delete role mock data------' + roles.body)
  return responseMockData()
}

export default {
  getSmsIndex: () => {
    return smsIndex
  },
  // 短信任务
  queryPushTaskById,
  delMsgPush,
  getMsgPushList: queryPushTaskList,
  // getPropelList: queryPushLog, // 短信任务分页查询接口-wuqiang
  // getTaskList: queryLoglistById, // 根据任务ID查询日志列表接口-wuqiang
  // getSmsTmplList,
  delSmsTmpl,
  signatures,
  // 系统管理 接口函数 wuhui
  systemGetList, systemUpdate,
  // 用户管理
  userGetList,
  userUpdate,
  // 角色管理
  roleGetList, roleUpdate, roleCreate, roleNewCode, roleDelete,
  getSignatures
}

