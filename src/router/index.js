import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/sms/index',
    name: '首页',
    hidden: true,
    children: [
      {
        path: 'index',
        component: _import('sms/index')
      }
    ]
  },
  {
    name: '首页 ',
    path: '/index',
    icon: 'people',
    component: Layout,
    redirect: '/sms/index',
    noDropdown: true,
    children: [
      {
        name: '首页  ',
        path: 'index',
        component: _import('sms/index'),
        meta: { role: 'admin' }
      }
    ]
  },
  {
    name: '短信任务',
    path: '/msgPush',
    component: Layout,
    redirect: '/sms/msgPush',
    icon: 'people',
    // noDropdown: true,
    children: [
      {
        path: 'msgPush',
        component: _import('sms/msgPush'),
        name: '推送任务管理',
        meta: { role: 'admin' }
      },
      {
        path: 'usrdiv',
        name: '推送日志 ',
        component: _import('sms/usrdiv'),
        meta: { role: 'admin' }
      },
      {
        path: 'addAPITask',
        name: '新增API任务',
        component: _import('sms/addAPITask'),
        meta: { role: 'admin' }
      },
      {
        path: 'addCommonTask',
        component: _import('sms/addCommonTask'),
        name: '新增营销任务 ',
        meta: { role: 'admin' }
      }
    ]
  },
  {
    name: '短信模板',
    path: '/msgTmpl',
    component: Layout,
    redirect: '/sms/msgTmpl',
    icon: 'people',
    // noDropdown: true,
    children: [
      {
        path: 'msgTmpl',
        component: _import('sms/msgTmpl/msgTmpl'),
        name: '短信模板 ',
        meta: { role: 'admin' }
      },
      {
        path: 'msgTmplAdd',
        component: _import('sms/msgTmpl/msgTmplAdd'),
        name: '新增/修改模板',
        meta: { role: 'admin' }
      }
    ]
  },
  {
    path: '/basicInfo',
    component: Layout,
    redirct: 'sms/basicInfo/signature',
    icon: 'clipboard',
    name: '基础信息',
    children: [
      {
        path: 'signature',
        component: _import('sms/basicInfo/signature'),
        name: '短信签名'
      },
      {
        path: 'addSignature',
        component: _import('sms/basicInfo/addSignature'),
        name: '新增'
      },
      {
        path: 'channel',
        component: _import('sms/basicInfo/channel'),
        name: '短信通道'
      },
      {
        path: 'modifyChannel',
        component: _import('sms/basicInfo/modifyChannel'),
        name: '修改短信通道'
      }
    ]
  },
  {
    path: '/system',
    name: '系统管理',
    component: Layout,
    redirect: '/system/users',
    icon: 'example',
    children: [
      {
        path: 'users',
        name: '用户管理',
        component: _import('sms/sysMgr/UsersMgr')
      },
      {
        path: 'role',
        name: '角色管理',
        component: _import('sms/sysMgr/RoleMgr')
      },
      {
        path: 'settings',
        name: '系统设置',
        component: _import('sms/sysMgr/SystemSettings')
      }
    ]
  }

]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/sms',
    component: Layout,
    redirct: '/sms/index',
    name: '短信推送平台',
    icon: 'example',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'index',
        component: _import('sms/index'),
        name: 'sms首页',
        meta: { role: 'admin' }
      },
      {
        path: 'msgPush',
        component: _import('sms/msgPush'),
        name: '推送任务管理 ',
        meta: { role: 'admin' }
      },
      {
        path: 'addCommonTask',
        component: _import('sms/addCommonTask'),
        name: '新增营销任务',
        meta: { role: 'admin' }
      },
      {
        path: 'dataStatistics',
        component: _import('sms/dataStatistics'),
        name: '数据统计',
        meta: { role: 'admin' }
      },
      {
        path: 'usrdiv',
        name: '推送日志',
        component: _import('sms/usrdiv')
      },
      {
        path: 'addAPITask',
        component: _import('sms/addAPITask'),
        name: '新增API任务 ',
        meta: { role: 'admin' }
      },
      {
        path: 'msgTmpl',
        component: _import('sms/msgTmpl/msgTmpl'),
        name: '消息模板'
      },
      {
        path: 'msgTmplAdd',
        component: _import('sms/msgTmpl/msgTmplAdd'),
        name: '新增/编辑模板'
      },
      {
        path: 'taskReview',
        component: _import('sms/task/taskReview'),
        name: '任务审核'
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   name: '权限测试',
  //   icon: 'lock',
  //   meta: { role: ['admin'] },
  //   noDropdown: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: _import('permission/index'),
  //       name: '权限测试页',
  //       meta: { role: ['admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   icon: 'icon',
  //   noDropdown: true,
  //   children: [
  //     { path: 'index', component: _import('svg-icons/index'), name: 'icons' }
  //   ]
  // },
  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: '/components/index',
  //   name: '组件',
  //   icon: 'component',
  //   children: [
  //     { path: 'index', component: _import('components/index'), name: '介绍 ' },
  //     {
  //       path: 'tinymce',
  //       component: _import('components/tinymce'),
  //       name: '富文本编辑器'
  //     },
  //     {
  //       path: 'markdown',
  //       component: _import('components/markdown'),
  //       name: 'Markdown'
  //     },
  //     {
  //       path: 'jsoneditor',
  //       component: _import('components/jsonEditor'),
  //       name: 'JSON编辑器'
  //     },
  //     {
  //       path: 'dndlist',
  //       component: _import('components/dndList'),
  //       name: '列表拖拽'
  //     },
  //     {
  //       path: 'splitpane',
  //       component: _import('components/splitpane'),
  //       name: 'SplitPane'
  //     },
  //     {
  //       path: 'avatarupload',
  //       component: _import('components/avatarUpload'),
  //       name: '头像上传'
  //     },
  //     {
  //       path: 'dropzone',
  //       component: _import('components/dropzone'),
  //       name: 'Dropzone'
  //     },
  //     {
  //       path: 'sticky',
  //       component: _import('components/sticky'),
  //       name: 'Sticky'
  //     },
  //     {
  //       path: 'countto',
  //       component: _import('components/countTo'),
  //       name: 'CountTo'
  //     },
  //     { path: 'mixin', component: _import('components/mixin'), name: '小组件' },
  //     {
  //       path: 'backtotop',
  //       component: _import('components/backToTop'),
  //       name: '返回顶部'
  //     }
  //   ]
  // },
  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: '/charts/index',
  //   name: '图表',
  //   icon: 'chart',
  //   children: [
  //     { path: 'index', component: _import('charts/index'), name: '介绍' },
  //     { path: 'keyboard', component: _import('charts/keyboard'), name: '键盘图表' },
  //     {
  //       path: 'keyboard2',
  //       component: _import('charts/keyboard2'),
  //       name: '键盘图表2'
  //     },
  //     { path: 'line', component: _import('charts/line'), name: '折线图' },
  //     { path: 'mixchart', component: _import('charts/mixChart'), name: '混合图表' }
  //   ]
  // },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: '综合实例',
  //   icon: 'example',
  //   children: [
  //     {
  //       path: '/example/table',
  //       component: _import('example/table/index'),
  //       redirect: '/example/table/table',
  //       name: 'Table',
  //       icon: 'table',
  //       children: [
  //         {
  //           path: 'dynamictable',
  //           component: _import('example/table/dynamictable/index'),
  //           name: '动态table'
  //         },
  //         {
  //           path: 'dragtable',
  //           component: _import('example/table/dragTable'),
  //           name: '拖拽table'
  //         },
  //         {
  //           path: 'inline_edit_table',
  //           component: _import('example/table/inlineEditTable'),
  //           name: 'table内编辑'
  //         },
  //         {
  //           path: 'table',
  //           component: _import('example/table/table'),
  //           name: '综合table'
  //         }
  //       ]
  //     },
  //     {
  //       path: 'form/edit',
  //       icon: 'form',
  //       component: _import('example/form'),
  //       name: '编辑Form',
  //       meta: { isEdit: true }
  //     },
  //     {
  //       path: 'form/create',
  //       icon: 'form',
  //       component: _import('example/form'),
  //       name: '创建Form'
  //     },
  //     {
  //       path: 'tab/index',
  //       icon: 'tab',
  //       component: _import('example/tab/index'),
  //       name: 'Tab'
  //     }
  //   ]
  // },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: '错误页面',
  //   icon: '404',
  //   children: [
  //     { path: '401', component: _import('errorPage/401'), name: '401' },
  //     { path: '404', component: _import('errorPage/404'), name: '404' }
  //   ]
  // },
  // {
  //   path: '/errlog',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errlog',
  //   icon: 'bug',
  //   noDropdown: true,
  //   children: [
  //     { path: 'log', component: _import('errlog/index'), name: '错误日志' }
  //   ]
  // },
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/download',
  //   name: 'excel',
  //   icon: 'excel',
  //   children: [
  //     {
  //       path: 'download',
  //       component: _import('excel/index'),
  //       name: 'export excel'
  //     },
  //     {
  //       path: 'download2',
  //       component: _import('excel/selectExcel'),
  //       name: 'export selected'
  //     },
  //     {
  //       path: 'upload',
  //       component: _import('excel/uploadExcel'),
  //       name: 'upload excel'
  //     }
  //   ]
  // },
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   name: 'zip',
  //   icon: 'zip',
  //   children: [
  //     { path: 'download', component: _import('zip/index'), name: 'export zip' }
  //   ]
  // },
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'theme',
  //   icon: 'theme',
  //   noDropdown: true,
  //   children: [{ path: 'index', component: _import('theme/index'), name: '换肤' }]
  // },
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   icon: 'clipboard',
  //   noDropdown: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: _import('clipboard/index'),
  //       name: 'clipboard'
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
