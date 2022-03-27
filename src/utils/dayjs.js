/**
 * 封装自定义 dayjs 日期处理模块
 */
import Vue from 'vue'
import * as dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().from(dayjs(value))
})

// 全局过滤器：处理时间格式
Vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})
