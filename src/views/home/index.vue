<template>
  <div class='home-container'>
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <img
        class="logo"
        src="./logo.png"
        slot="left"
      >
      <van-button
        class="search-btn"
        icon-prefix="icon"
        icon="sousuo1"
        slot="right"
        round
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 文章频道列表 -->
    <van-tabs
      v-model="active"
      swipeable
    >
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <!-- 面包按钮插槽 -->
      <div slot="nav-right" class="wap-nav-place"></div>
      <div
        slot="nav-right"
        @click="isChannelEditShow = true"
        class="wap-nav-wrap"
      >
        <van-icon class-prefix="icon" name="liebiao"/>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      closeable
      :style="{ height: '100%' }"
      get-container="body"
    >
      <channel-edit
        :active="active"
        :userChannels = "channels"
        @close="isChannelEditShow = false"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: [],
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 控制编辑频道的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) { // 已登录，请求获取线上的频道数据
        // 请求获取频道数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else { // 未登录,判断是否有本地存储
        const localChannels = getItem('channels')
        if (localChannels) {
          // 有本地频道数据，则使用
          channels = localChannels
        } else {
          // 没有本地频道数据，则请求获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 将数据更新到组件中
      this.channels = channels
    },

    // 接收自子组件并注册了此函数。上面注册时是不必写形参
    onUpdateActive (index) {
      // @uodate-active="active = $event" 亦可,$event代替实参
      this.active = index // 切换激活的标签
    }
  }
}
</script>

<style scoped lang='less'>
.home-container{
  // 头部导航栏样式
  .app-nav-bar{
    .logo{
      width: 100px;
    }
    .search-btn{
      width: 230px;
      height: 32px;
      border: none;
      .van-button__text{
        font-size: 14px;
      }
      .icon-sousuo1{
        font-size: 14px;
        color: #323233;
      }
    }
  }
  // 频道列表样式
  /deep/ .van-tabs__line{
    background-color: rgb(25, 137, 250);
  }
  // 频道弹出层样式
  .wap-nav-place{
    // 给flex元素的子级定宽又不破坏分布，要先flex-shrink: 0;
    flex-shrink: 0;
    width: 48px;
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0;
    height: 44px;
    padding: 0 12px;
    background-color:rgba(255, 255, 255, 0.9);
    .icon{
      font-size: 20px;
      line-height: 46px;
      color: rgb(25, 137, 250);
    }
    // vue中使用伪类元素
    // &:before{
    //   content: '';
    //   width: 2px;
    //   height: 24px;
    //   background-color: rgba(25, 137, 250, 0.9);
    //   position: absolute;
    //   left: 0;
    //   top:10px;
    // }
  }
}
</style>
