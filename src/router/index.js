import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

// 路由表
const routes = [
  { // 登录
    path: '/login',
    name: 'login',
    // 路由的懒加载语法，一种简写
    component: () => import('@/views/login/'),
    meta: { requiresAuth: false } // 给路由添加额外的自定义数据
  },
  { // 底部标签栏
    path: '/',
    // 有子路由，故而不用写name
    component: () => import('@/views/layout/'),
    children: [
      { // 首页
        path: '', // 默认子路由,故而路径留空
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requiresAuth: false }
      },
      { // 问答
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requiresAuth: false }
      },
      { // 视频
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requiresAuth: false }
      },
      { // 我的
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requiresAuth: false }
      }
    ]
  },
  { // 搜索页
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false }
  },
  { // 文章详情
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat/'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数
router.beforeEach((to, from, next) => {
  // 判断页面是否需要登录才能访问
  if (to.meta.requiresAuth) {
    // 如果已登录，则直接通过
    if (store.state.user) {
      return next()
    }
    // 没有登录，提示用户是否登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗'
    })
      .then(() => { // 确认
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => { // 取消
        next(false) // 取消了，中断路由导航
      })
  } else {
    // 不需要登录状态的页面，直接过去
    next()
  }
})

export default router
