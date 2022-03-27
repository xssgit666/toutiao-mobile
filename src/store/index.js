import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

// 目的避免访问和获取数据的名字不一致导致问题
const USER_KEY = 'MY_USER'

export default new Vuex.Store({
  state: {
    // 用户的登录状态信息，从本地存储中取出
    user: getItem(USER_KEY), // getItem在storage.js中封装的模块
    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 防止用户刷新后数据丢失，需把数据放到本地存储中
      setItem(USER_KEY, state.user) // setItem在storage.js中封装的模块
    },
    // 添加缓存页面
    addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存页面
    removeCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
