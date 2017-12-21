import Mock from 'mockjs'
import {
  param2Obj
} from '@/utils'

/**
 * author: YYQ
 * content: 短信模板列表mock
 */
var smsTmplList = []
const count = Mock.mock('@integer(1,50)')
// 产生随机参数队列
function makeParamsList(paramsCount=Mock.mock('@integer(1,10)')){
  let paramsList = []
  for (let i = 0; i < paramsCount; i++){
    let k = Mock.mock('@word(1,5)')
    const paramData = Mock.mock({
      key: k,
      length: '@integer(1,20)',
      value: '${'+ k +'}'
    })
    paramsList.push(paramData)
  }
  return paramsList
}
function makeContentList(contentCount=Mock.mock('@integer(1,10)')){
  let contentList = []
  for(let i=0; i<contentCount; i++){
    const contentData = Mock.mock({
      'type|1': ['text', 'param'],
       value: ''
    })
    contentList.push(contentData)
  }
  for(let i=0; i<contentList.length; i++){
    if(contentList[i].type == 'text'){
      contentList[i].value = Mock.mock('@cparagraph()')
    }else{
      contentList[i].value = '${'+ Mock.mock('@word(1,5)') +'}'
    }
  }
  return contentList
}
// 产生随机模板列表接口数据
for (let i = 0; i < count; i++) {
  const data = Mock.mock({
    id: 'M' + '@integer( 10000000, 99999999 )',
    name: '@ctitle()',
    creatTime: '@datetime()',
    description: '@csentence()',
    'isActive|1': ['1', '2'],
    content: makeContentList(),
    params: makeParamsList()
  })
  smsTmplList.push(data)
}
/**
 * author: YYQ
 * content: 短信模板列表mock接口
 */
function getSmsTmplList(objString) {
  const urlObj = param2Obj(objString.url)
  console.log('获取短信模板：', urlObj)
  if(urlObj.key){
    return {
      code: '000000',
      data: querySmsTmplList(objString)
    }
  }
  return {
    code: '000000',
    data: smsTmplList
  }
}
/**
 * author: YYQ
 * content: 短信模板列表删除mock接口 by id(单条或者多条)
 */
function delSmsTmpl(objString) {
  // indexArr = {url: "https://api-dev/sms/templates/delete?id=0", type: "DELETE", body: null}
  const urlObj = param2Obj(objString.url)
  console.log(urlObj)
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
  return {
    code: '000000',
    data: smsTmplList
  }
}
/**
 * author: YYQ
 * content: 短信模板列表查询接口 by key
 */
function querySmsTmplList(objString) {
  const urlObj = param2Obj(objString.url)
  return queryLists(urlObj, smsTmplList)
}
// ---------------------------------------
function queryLists(params, xxLists) {
  return xxLists.filter(item => {
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i++) {
      const param = params[keys[i]]
      if (param === item['id'] || param === item['name']) {
        return true
      }
    }
    return false
  })
}
/**
 * author: YYQ
 * content: 短信模板更新接口
 */
function updateSmsTmpl(config){
  return {
    code: '000000',
    data: '更新成功!'
  }
}

function addSmsTmpl(config){
  return {
    code: '000000',
    data: '新增模板成功!'
  }
}

// 2.1.23	根据短信模板id列表查询待执行和正在执行的任务
function querySmsTmplTask(objString){
  return {
    code: '000000',
    message: '成功',
    data: makeSmsTmplTask()
  }
}
function makeSmsTmplTask(taskCount=Mock.mock('@integer(0,3)')){
  let smsTmplTaskList = []
  for(let i=0;i<taskCount;i++){
    let taskObj = {
      templateName: Mock.mock('@cword(3,10)'),
      taskIds: makeTaskIds()
    }
    smsTmplTaskList.push(taskObj)
  }
  return smsTmplTaskList
}
function makeTaskIds(count=Mock.mock('@integer(1,30)')){
  let ids = []
  for(let i=0;i<count;i++){
    let id = Mock.mock('@natural(10000000,99999999)')
    ids.push(id)
  }
  return ids
}

export default {
  getSmsTmplList,
  delSmsTmpl,
  querySmsTmplList,
  updateSmsTmpl,
  addSmsTmpl,
  querySmsTmplTask
}
