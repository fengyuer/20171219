import Mock from 'mockjs'
import { param2Obj } from '@/utils'
/** ************** 首页 *******************/
const xxLists = []
const xxCount = Mock.mock('@integer(0, 30)')
for (var i = 0; i < xxCount; i++) {
  xxLists.push(Mock.mock({
    id: '@giud'
  }))
}
const xxObj = {}
const addXX = function(config) {
  const newObj = Mock.mock({
    id: '@giud'
  })
  const urlObj = param2Obj(config.url)// 是从url取参数，还是从body里去参数，是根据各自的接口文档而定的
  const bodys = JSON.parse(config.body)
  copyTo(urlObj, newObj)
  copyTo(bodys, newObj)
  xxLists.push(newObj)
}
const delXX = function(config) {
  const { id } = param2Obj(config.url)
  delById(id, xxLists)
}
const updateXX = function(config) {
  const { id } = param2Obj(config.url)
  const newObj = JSON.parse(config.body)
  updateById(id, xxLists, newObj)
}
const queryXXs = function(config) {
  const urlObj = param2Obj(config.url)
  queryLists(urlObj, xxLists)
}
const queryXXById = function() {}
function queryLists(params, xxLists) {
  return xxLists.filter(item => {
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i++) {
      const param = params[keys[i]]
      if (param !== item[param]) {
        return false
      }
    }
    return true
  })
}
function updateById(id, dbLists, newObj) {
  dbLists.forEach(function(val, index) {
    if (id === val.id) {
      copyTo(newObj, dbLists[index])
    }
  })
}
function delById(id, dbLists) {
  dbLists.forEach(function(val, index) {
    if (id === val.id) {
      dbLists.splice(index, 1)
    }
  })
}
function copyTo(oriObj, destObj) {
  Object.keys(oriObj).forEach(function(val, index) {
    destObj[val] = oriObj[val]
  })
}

/** ************** 短信任务 *******************/

/** ************** 短信模板 *******************/
/** ************** 基础信息 *******************/
/** ************** 数据统计 *******************/
/** ************** 任务审核 *******************/
/** ************** 系统管理 *******************/

export default {
/** ************** 模块 *******************/
  addXX,
  delXX,
  updateXX,
  queryXXs,
  queryXXById
}

