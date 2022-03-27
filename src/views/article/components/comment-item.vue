<template>
  <van-cell
    class='comment-item'
  >
    <van-image
      class="avatar"
      slot="icon"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{comment.aut_name}}</div>
        <div slot="default" class="like-wrap" @click="onCommentLike">
          <van-icon
            :class="{
              liked: comment.is_liking
            }"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
          />
          <span class="like-count">{{comment.like_count}}</span>
        </div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
    <div slot="label" class="reply">
        <span class="pubdate">{{comment.pubdate | datetime('MM-DD HH:mm')}}</span>
        <van-button
          round
          class="reply-btn"
          size="mini"
          @click="$emit('reply-click', comment)"
        >{{comment.reply_count}} 回复</van-button>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 给文章评论点赞
    async onCommentLike () {
      const commentId = this.comment.com_id.toString() // 把id字符串化
      if (this.comment.is_liking) {
        await deleteCommentLike(commentId)
        this.comment.like_count--
      } else {
        await addCommentLike(commentId)
        this.comment.like_count++
      }
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style scoped lang='less'>
.comment-item{
    .avatar{
        width: 36px;
        height: 36px;
        margin-right: 13px;
    }
    .title-wrap{
        display: flex;
        justify-content: space-between;
        .name{
            font-size: 14px;
            color: #406599;
        }
        .like-wrap{
            display: flex;
            align-items: center;
            justify-content: center;
            .liked{
              color: #e5645f;
            }
        }
    }
    .content{
        text-align: justify;
        font-size: 16px;
        color: #222;
    }
    .pubdate{
        font-size: 12px;
        margin-right: 14px;
    }
    .reply{
        display: flex;
        align-items: center;
        .reply-btn{
            background-color: #F4F5F6;
            border: none;
            padding: 0 10px;
            height: 20px;
        }
    }
}
</style>
