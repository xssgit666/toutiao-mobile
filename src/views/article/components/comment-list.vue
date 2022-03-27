<template>
  <div class='comment-list'>
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment = 'comment'
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      // 数组或者对象的默认值必须通过函数返回，否则会报错
      default: () => [] // 箭头函数
    }
  },
  data () {
    return {
      // list: [], // 本组件原来有自己的list，后因父组件要更新该list,故而通过prop传值的方式在父组件创建了一个list,而后传给本组件使用，默认值为空
      loading: false,
      finished: false,
      offset: null, // 获取下一页页码
      limit: 10 // 每页大小
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 1.请求数据
      const { data } = await getComments({
        type: this.type, // 评论类型.本可直接传a,后续需要同组件获取评论的回复
        source: this.source.toString(), // 文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id,页码
        limit: this.limit // 获取的评论数据个数
      })
      // 2.放入列表
      const { results } = data.data
      this.list.push(...results)
      // 2.1更新首页父组件的评论总数
      this.$emit('updata-count', data.data.total_count)
      // 3.关闭loading
      this.loading = false
      // 4.判断是否还有数据，finished改为true
      if (results.length) {
        // 如果还有数据，就把下一页数据加载出来
        this.offset = data.data.last_id
      } else {
        // 如果没有，就不加载了
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-cell::after{
  border-bottom: none;
}
</style>
