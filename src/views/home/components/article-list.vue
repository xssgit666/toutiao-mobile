<template>
  <div class='article-list' ref="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="真的没有了啦 Ծ‸Ծ"
        @load="onLoad"
      >
        <article-item
          v-for="(article,index) in articles"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash' // 处理滚动监听事件的防抖
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载结束的状态，当加载结束，不再触发加载更多
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的loading状态
      refreshSuccessText: '', // 下拉刷新成功的提示文本
      scrollTop: 0 // 列表滚动到顶部的距离
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    // 监听滚动事件
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    // 从缓存中被激活
    // 把记录的到顶部的距离重新设置回去
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  deactivated () {
    // 组件失去活动了
  },
  methods: {
    // 获取文章列表
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳，timestamp 相当于页码，请求最新数据使用当前最新时间戳，下一页数据使用上一次返回的数据中的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 2. 把数据放到 list 数组中
      const { results } = data.data // 解构赋值
      this.articles.push(...results) // 数组拼接
      // 3. 设置本次加载状态结束，它才可以判断是否需要加载下一次，否则就会永远的停在这里
      this.loading = false
      // 4. 数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        timestamp: Date.now(), // 接口设置的，只要传递不同的时间戳就一定返回不一样的数据，而且数据不为空
        with_top: 1
      })
      // 2. 把数据放到数据列表中（往顶部追加）
      const { results } = data.data
      this.articles.unshift(...results)
      // 3. 关闭刷新的状态 loading
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang='less'>
.article-list{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    top: 90px;
    overflow-y: auto;
}
</style>
