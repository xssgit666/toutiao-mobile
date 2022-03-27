<template>
  <div class='comment-reply'>
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon
        slot="right"
        name="cross"
        @click="$emit('close')"
      />
    </van-nav-bar>

    <div class="reply">
        <!-- 当前评论项 -->
        <comment-item :comment="comment"/>
        <!-- 回复评论列表 -->
        <comment-list
        :source="comment.com_id"
        :list="commentList"
        type="c"
        />
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        color="#E9EBEC"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
    </div>

    <!-- 发布回复 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
      round
    >
      <post-comment
        :target='comment.com_id'
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    // 查看回复的评论项
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      isPostShow: false, // 控制回复的显示状态
      commentList: [] // 回复评论的列表
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 处理发布结果
    onPostSuccess (comment) {
      // 将最新发布的评论展示到列表的顶部
      this.commentList.unshift(comment)
      // 关闭发布评论的弹层
      this.isPostShow = false
      // 更新评论总数
      this.comment.reply_count++
    }
  }
}
</script>

<style scoped lang='less'>
.reply{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    top:27%;
    overflow-y: auto;
}
.article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
        width: 200px;
        .van-button__text{
            color: #333;
        }
    }
}
</style>
