import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/dayjs'

// 加载 Vant 组件库
import Vant from 'vant'
// 加载 Vant 组件库样式
import 'vant/lib/index.css'

// 加载自设的全局样式
import './styles/index.less'

// 自动设置 Rem 基准值（ html 标签字体大小）
import 'amfe-flexible'

// 全局注册 Vant 中的组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
