/**
 * 进行CRUD的操作
 * author chn
 */
/**
 *根据条件查询列表
 * @param {* 查询条件} params
 * @param {* 要查询的目标列表} xxLists
 */
export function queryLists(params, xxLists) {
  return xxLists.filter(item => {
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i++) {
      const param = params[keys[i]]
      if (param && param !== item[keys[i]]) {
        return false
      }
    }
    return true
  })
}
/**
 * 根据id更新数据
 * @param {*} id
 * @param {* 要跟新的目标列表} dbLists
 * @param {* 要更新的数据对象} newObj
 */
export function updateById(id, dbLists, newObj) {
  dbLists.forEach(function(val, index) {
    if (id === val.id) {
      copyTo(newObj, dbLists[index])
    }
  })
}
/**
 * 根据id进行删除操作
 * @param {*} id
 * @param {*} dbLists
 */
export function delById(id, dbLists) {
  dbLists.forEach(function(val, index) {
    if (id === val.id) {
      dbLists.splice(index, 1)
    }
  })
}
/**
 * 把一个对象的属性复制到另一个对象里面
 * @param {* 要复制属性的对象} oriObj
 * @param {*属性复制进入的对象，目标对象} destObj
 */
export function copyTo(oriObj, destObj) {
  Object.keys(oriObj).forEach(function(val, index) {
    destObj[val] = oriObj[val]
  })
}
