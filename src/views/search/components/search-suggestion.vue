<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(str, index) in suggestions"
      :key="index"
      icon-prefix="icon"
      icon="sousuo1"
      @click="$emit('search', str)"
    >
      <!-- v-html后也可调用函数方法 -->
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from 'lodash'
import { getSuggestions } from '@/api/search'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    // 属性名：监视的数据名(此处要监视用户在搜索框输入的内容，以便后续联想搜索)
    searchText: { // 侦听的完整写法
      // 数据发生变化时执行handler函数，注意async位置
      handler: debounce(async function () { // debounce({}，100)方法防抖动
        const { data } = await getSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 300), // 1秒内不触发函数
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 高亮函数。返回值：替换之后的高亮字符串
    highlight (str) {
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      return str.replace(new RegExp(this.searchText, 'gi'), `<span style="color: #3296fa">${this.searchText}</span>`)

      // 若只替换第一个符合字符，不用正则，代码可如下
      // return str.toLowerCase().replace(
      //   this.searchText.toLowerCase(),
      //   `<span style="color: red;">${this.searchText}</span>`
      // )
    }
  }
}
</script>

<style scoped lang='less'>

</style>
