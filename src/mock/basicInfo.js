import Mock from 'mockjs'
import { param2Obj } from '@/utils'

/** ************** 基础信息start *******************/
/**
 * author: Fiona
 * content: 短信签名
 */

//  短信签名总数据
const signatureLists = []
const signatureCount = Mock.mock('@natural(0, 8)')
for (let i = 0; i < signatureCount; i++) {
  signatureLists.push(Mock.mock({
    'id|+1': `SG${'@natural(001,1000)'}`,
    'name': '@first',
    'channelName': '@last',
    'creater': '@cname',
    'isActive|1': [1, 2],
    'createTime': '@datetime',
    'description': '@csentence(4,8)'
  }))
}

// 短信签名查询列表2.1.15
const querySignatures = function(config) {
  const { key = '' } = param2Obj(config.url)
  const searchList = queryLists({ key }, signatureLists)

  return {
    code: '000000',
    message: '成功',
    data: searchList
  }
}

// 新增短信签名2.1.12
const addSignature = function(config) {
  const { name, isActive, description, channelName } = param2Obj(config.url)

  const newObj = {
    id: Mock.mock(`SG${'@natural(001,1000)'}`),
    name,
    channelName,
    creater: Mock.mock('@cname'),
    isActive,
    createTime: Mock.mock('@now'),
    description
  }

  signatureLists.unshift(newObj)
  console.log(newObj)

  return {
    code: '000000',
    message: '成功',
    data: {
    }
  }
}

// 批量删除短信签名2.1.14
const delSignature = function(config) {
  const { ids } = param2Obj(config.url)

  delByIds(ids, signatureLists)

  return {
    code: '000000',
    message: '删除成功',
    data: {
    }
  }
}
// 执行状态 执行列表
// -- 是否批量删除待确认 先按单个删除
const SignatureUsedData = function(config) {
  const { id } = param2Obj(config.url)

  const usedList = Mock.mock({
    'usedList|0-3': {
      id: '@guid',
      'templateName': '@last'
    }
  })

  return {
    code: '000000',
    message: '删除成功',
    data: {
      id,
      usedList: usedList
    }

  }
}

// 短信签名启用状态
const toOpenSignature = function(config) {

}

 /**
 * author: Fiona
 * content: 短信通道
 */

//  短信通道总数据
const channelLists = []
const channelCount = Mock.mock('@natural(1, 3)')
for (let i = 0; i < channelCount; i++) {
  channelLists.push(Mock.mock({
    'id|+1': `P${'@natural(001,1000)'}`,
    'name': '@first',
    'price': '@float(0,0,1,3)',
    'description': '@csentence(4,8)',
    'version': '1.0',
    'createTime': '@datetime',
    'isDefault': '@boolean(1,9, true)',
    'isActive|1': [1, 2]
    // 'isAdded': '@boolean'
  }))
}

// 短信通道查询列表2.1.17
const queryChannels = function(config) {
  const { key = '' } = param2Obj(config.url)
  const searchList = queryLists({ key }, channelLists)
  return {
    code: '000000',
    message: '成功',
    data: searchList
  }
}

//  短信通道修改2.1.16
const updateChannel = function(config) {
  const { id, price, description } = param2Obj(config.url)

  const newObj = {
    id,
    name,
    price,
    description,
    createTime: Mock.mock('@now')
  }

  updateData(id, newObj, channelLists)

  return {
    code: '000000',
    message: '修改成功',
    data: {}
  }
}

// ------------common methods

// 根据id或name查询的列表
function queryLists(params, lists) {
  const filterObj = searchObj => obj => {
    if (obj.id.includes(searchObj)) {
      return true
    }
    if (obj.name.includes(searchObj)) {
      return true
    }
  }

  return lists.filter(filterObj(params.key))
}

// 删除
const delByIds = (ids, lists) => {
  const idsArr = ids.split(',')
  lists.forEach((v, index) => {
    if (idsArr.includes(v.id)) {
      lists.splice(index, 1)
    }
  })
  console.log(ids)
}

// 更新
const updateData = (id, newObj, lists) => {
  lists.find((v, index) => {
    if (v.id === id) {
      lists[index] = newObj
    }
  })
}

 /** ************** 基础信息end *******************/

export default {
// 短信签名
  querySignatures,
  addSignature,
  delSignature,
  toOpenSignature,
  SignatureUsedData,
// 短信通道
  queryChannels,
  updateChannel
}
