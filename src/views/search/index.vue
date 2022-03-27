<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        shape="round"
        background="#1989fa"
        placeholder="请输入搜索关键词"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      >
        <van-icon
          slot="left-icon"
          class-prefix="icon"
          name="sousuo1"
        ></van-icon>
      </van-search>
    </form>
    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :searchText = searchText
    />
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText = searchText
      @search="onSearch"
    />
    <!-- 历史记录 -->
    <search-history
      v-else
      :searchHistories = searchHistories
      @update-histories = "searchHistories = $event"
      @search="onSearch"
    />
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: [],
  data () {
    return {
      searchText: '', // 搜索的文本
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史数据.无本地存储则为空数组
    }
  },
  computed: {},
  watch: {
    // 监视搜索历史记录的变化，存储到本地
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (searchText) {
      // 用于接收联想搜索组件发射来的实参searchText，并赋值给真正的searchText
      this.searchText = searchText

      // 记录搜索历史记录
      // Arr.indexOf()如果在数组中没找到指定元素则返回 -1
      const index = this.searchHistories.indexOf(searchText) // 不加引号
      if (index !== -1) {
        // 把重复的搜索记录删掉
        this.searchHistories.splice(index, 1)
      }
      // 把最新的搜索历史记录放到顶部
      this.searchHistories.unshift(searchText)
      // 存至本地永久化。上面已watch监视，下行代码可注释
      // setItem('search-histories', this.searchHistories)

      // 展示搜索结果
      this.isResultShow = true
    }
  }
}
</script>

<style scoped lang='less'>
.search-container{
    .van-search__action{
        color: #fff;
    }
}
</style>
