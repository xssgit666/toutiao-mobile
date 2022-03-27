// 封装 axios 请求模块
import axios from 'axios'
import store from '@/store/' // 在非组件模块中获取 store
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router/'

// 创建用来获取新token的
const refreshTokenReq = axios.create({
  // 基础路径
  baseURL: 'http://toutiao.itheima.net/'
})

const request = axios.create({
  // 基础路径
  baseURL: 'http://toutiao.itheima.net/',

  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }
    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器(从axios的git仓库中获取)，config即请求头信息
request.interceptors.request.use(function (config) {
  // 在发送请求之前做一些事情
  const { user } = store.state
  // 如果用户已登录，则统一给接口设置 token 信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 做一些请求错误的事情
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 任何在 2xx 范围内的状态码都会触发这个函数
  return response
}, async function (error) {
  // 任何超出 2xx 范围的状态代码都会触发此功能
  const status = error.response.status
  if (status === 400) {
    // 客户端参数异常
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token无效
    // 1.如果没有user或者user.token，直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转登录页
      return redirectLogin()
    }
    // 2.使用refresh_token请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 3.拿到新的token之后把他更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)
      // 把失败的请求重新发出去
      return request(error.config)
    } catch (err) {
      // 直接跳转登录页
      redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }

  return Promise.reject(error) // 抛出异常，这个不能动
})

// 封装一个函数用来跳转登录页
function redirectLogin () {
  router.replace({
    name: 'login',
    // 传递查询参数，会以？作为分隔符放到url后面
    query: {
      // 数据名是自己取的
      // router.currentRoute和我们在组件中获取的this.$router是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
