import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { queryLists } from './CRUD.js'
import _ from 'lodash'
/**
 * author: sll
 * content:数据统计列表mock
 */
const statisList = []
const statisCount = Mock.mock('@integer(0,100)')
for (let i = 0; i < statisCount; i++) {
  statisList.push(
    Mock.mock({
      date: Date.now() + Mock.mock('@integer(-1000000000,1000000000)'),
      sendNum: '@integer(0,1000)',
      sendSuccessNum: '@integer(0,990)',
      sendFailureNum: '@integer(0,10)',
      successRatio: '@integer(0,100)',
      price: '@integer(0,3000)'
    })
  )
}

/**
 * author: sll
 * content:数据统计列表分页查询
 */
function queryStatisList(config) {
  const urlObj = param2Obj(config.url)
  const { startTime, endTime, granularity, department, creater, templateName, signName, channelName } = param2Obj(config.url)
  // const searchList = _.cloneDeep(queryLists({ startTime, endTime, granularity, department, creater, templateName, signName, channelName }, statisList))
  const searchList = statisList
  const pageList = searchList.slice((urlObj.pageNum - 1) * urlObj.pageSize, urlObj.pageNum * urlObj.pageSize)
  return Mock.mock({
    code: '000000',
    message: '成功',
    data: {
      pageSize: urlObj.pageSize,
      currentPage: urlObj.pageNum,
      recordsTotal: searchList.length,
      data: parseInt(urlObj.pagination) ? searchList : pageList
    }
  })
}

export default{
  queryStatisList
}
