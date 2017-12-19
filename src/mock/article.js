import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const PropelList = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@cname',
    auditor: '@cname',
    title: '@ctitle(10, 20)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)',
    createDate: +Mock.Random.date('T'),
    taskID: '@integer(1, 9)',
    smsTemplet: '@ctitle(3, 8)',
    smsSign: '@ctitle(3, 6)',
    sendCrowd: '@ctitle(3, 8)',
    sendNum: '@integer(1, 9)',
    sendCount: '@integer(1, 9)',
    sendTime: +Mock.Random.date('T'),
    creater: '@cname',
    'taskType|1': ['普通任务', 'API任务'],
    'section|1': ['研究院'],
    phoneNum:'@integer(11111111111,19999999999)',
    smsCount:'@integer(1, 9)',
    receiveTime: +Mock.Random.date('T'),
    failReason: '@ctitle(3, 10)',
    'sendState|1': ['成功', '失败'],
    'smsPass|1': ['漫道']
  }))
}

for (let i = 0; i < count; i++) {
  PropelList.push(Mock.mock({
    id: '@increment',
    taskID: '@integer(1, 9)',
    smsTemplet: '@ctitle(3, 8)',
    smsSign: '@ctitle(3, 6)',
    sendCrowd: '@ctitle(3, 8)',
    sendNum: '@integer(1, 9)',
    sendCount: '@integer(1, 9)',
    sendTime: +Mock.Random.date('T'),
    creater: '@cname',
    'taskType|1': ['普通任务', 'API任务'],
    'section|1': ['研究院'],
    phoneNum:'@integer(11111111111,19999999999)',
    smsCount:'@integer(1, 9)',
    receiveTime: +Mock.Random.date('T'),
    failReason: '@ctitle(3, 10)',
    'sendState|1': ['成功', '失败'],
    'smsPass|1': ['漫道']
  }))
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getPv: () => ({
    pvData: [{ key: 'PC网站', pv: 1024 }, { key: 'mobile网站', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getArticle: () => ({
    id: 120000000001,
    author: { key: 'mockPan' },
    source_name: '原创作者',
    category_item: [{ key: 'global', name: '全球' }],
    comment_disabled: false,
    content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
    content_short: '我是测试数据',
    display_time: +new Date(),
    image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    platforms: ['a-platform'],
    source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
    status: 'published',
    tags: [],
    title: ''
  })
}
