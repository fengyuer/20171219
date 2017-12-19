import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import smsMock from './smsMock'
import BasicInfo from './basicInfo'
import smsTmplMock from './smsTmplMock'
import statistics from './statistics'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// sms短信推送
Mock.mock(/\/sms\/index/, 'get', smsMock.getSmsIndex)

// sms数据统计  -sll
Mock.mock(/\/sms\/numbers/, 'get', statistics.queryStatisList)

// sms短信模板-YYQ
Mock.mock(/\/sms\/templates/, 'get', smsTmplMock.getSmsTmplList)
Mock.mock(/\/sms\/templates\/delete/, 'delete', smsTmplMock.delSmsTmpl)

Mock.mock(/\/sms\/templates/, 'put', smsTmplMock.updateSmsTmpl)

/* ************ 短信任务start-chn ********* */
// sms推送任务管理  -sll
Mock.mock(/\/sms\/task/, 'get', smsMock.getMsgPushList)// 查询列表
Mock.mock(/\/sms\/task/, 'delete', smsMock.delMsgPush)
Mock.mock(/\/sms\/marketTask/, 'post', smsMock.addPushTask)
Mock.mock(/\/sms\/apiTask/, 'post', smsMock.addApiTask)
Mock.mock(/\/sms\/taskDetail/, 'get', smsMock.queryPushTastById)
Mock.mock(/\/sms\/record/, 'get', smsMock.queryLogById)
Mock.mock(/\/sms\/record\/export/, 'get', smsMock.exportTast)
/* ************ 短信任务end-chn ********* */

/* ************ 基础信息start-F ********* */

// 短信签名-F
Mock.mock(/\/sms\/signatures/, 'get', BasicInfo.querySignatures)
Mock.mock(/\/sms\/signatures\/add/, 'post', BasicInfo.addSignature)
Mock.mock(/\/sms\/signatures\/delete/, 'delete', BasicInfo.delSignature)
Mock.mock(/\/sms\/signatures\/toOpen/, 'post', BasicInfo.toOpenSignature)

// 短信通道-F
Mock.mock(/\/sms\/channels/, 'get', BasicInfo.queryChannels)
Mock.mock(/\/sms\/channels\/update/, 'put', BasicInfo.updateChannel)

/* ************ 基础信息end-F ********* */

// 系统管理 wh
Mock.mock(/\/api-dev\/system\/settings/, 'get', smsMock.systemGetList)
Mock.mock(/\/api-dev\/system\/settings/, 'put', smsMock.systemUpdate)
// 用户管理　wh
Mock.mock(/\/api-dev\/system\/users/, 'get', smsMock.userGetList)
Mock.mock(/\/api-dev\/system\/users/, 'put', smsMock.userUpdate)
// 角色管理
Mock.mock(/\/api-dev\/system\/role\/newRoleCode/, 'get', smsMock.roleNewCode)
Mock.mock(/\/api-dev\/system\/role/, 'get', smsMock.roleGetList)
Mock.mock(/\/api-dev\/system\/role/, 'put', smsMock.roleUpdate)
Mock.mock(/\/api-dev\/system\/role/, 'put', smsMock.roleCreate)
Mock.mock(/\/api-dev\/system\/role/, 'delete', smsMock.roleDelete)

Mock.mock(/\/api-dev\/sms\/sysMgr\/usrdiv/, 'get', smsMock.getPropelList)
Mock.mock(/\/api-dev\/sms\/sysMgr\/usrdiv\/taskDetail/, 'get', smsMock.getTaskList)

export default Mock
