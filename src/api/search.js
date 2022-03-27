/**
 * 搜索相关接口模块
 */
import request from '@/utils/request'

// 获取联想搜索结果
export function getSuggestions (q) {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果
export function getSearch (params) {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}

// 获取搜索历史---此接口已废
// export const getSearchHistories = () => {
//   return request({
//     method: 'GET',
//     url: '/v1_0/search/histories'
//   })
// }
