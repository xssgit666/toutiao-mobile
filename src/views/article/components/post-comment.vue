<template>
  <div class='post-comment'>
      <van-field
        class="post-text"
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="输入您的评论"
        show-word-limit
      />
      <van-button
        size="small"
        round
        type="info"
        :disabled="!message"
        class="post-btn"
        @click="onPost"
      >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'PostComment',
  components: {},
  props: {
    target: {
      type: [String, Number, Object],
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      default: null
    }
  },
  data () {
    return {
      message: '' // 输入框内容
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      // 显示loading
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // 请求数据
        const { data } = await addComment({
          target: this.target.toString(), // 文章id
          content: this.message, // 文章评论内容
          art_id: this.articleId ? this.articleId.toString() : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // 处理发布结果
        this.$emit('post-success', data.data.new_obj)
        // 提示发布成功
        this.$toast.success('发布成功')
        // 清空文本框
        this.message = ''
      } catch (error) {
        // 提示发布失败。否则会有bug
        this.$toast.fail('请先登录账号')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.post-comment{
    display: flex;
    align-items: center;
    padding: 14px;
    .post-text{
        border-radius: 10px;
        margin-right: 10px;
        background-color: #E9EBEC;
    }
    .post-btn{
        width: 54px;
        height: 25px;
    }
}
</style>
