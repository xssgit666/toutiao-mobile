<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章内容 -->
    <div class="article-wrap">
      <!-- 作者信息 -->
      <h1 class="title">{{article.title}}</h1>
      <van-cell center class="user-info">
        <van-image
          class="avatar"
          slot="icon"
          round
          :src="article.aut_photo"
        />
        <div slot="title" class="name">{{article.aut_name}}</div>
        <div slot="label" class="pubdate">{{ article.pubdate | relativeTime }}</div>
        <van-button
          class="follow-btn"
          :icon="article.is_followed ? '' : 'plus'"
          :type="article.is_followed ? 'default' : 'info'"
          round
          size="small"
          :loading="isFollowLoading"
          @click="onFollow"
        >{{article.is_followed ? '已关注' : '关注'}}</van-button>
      </van-cell>
      <!-- 文章内容 -->
      <div
        class="content markdown-body"
        v-html="article.content"
        ref="article-content"
      >
      </div>
      <!-- 正文结束 -->
      <van-cell
        title="———— 正文结束 ————"
        class="finish"
      ></van-cell>
      <!-- 评论列表 -->
      <comment-list
        :source='articleId'
        :list="CommentList"
        @updata-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
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
      <van-icon
        name="comment-o"
        :badge="totalCommentCount"
        color="#777"
      />
      <van-icon
        :color="article.is_collected ? 'orange' : ''"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude === 1 ? '#e5645f' : ''"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777"></van-icon>
    </div>

    <!-- 发布评论 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
      round
    >
      <post-comment
        :target='articleId'
        @post-success="onPostSuccess"
      />
    </van-popup>

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css' // 加载使用markdown的文本格式
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { ImagePreview } from 'vant' // 预览组件需单独引用
import { addFollow, deleteFollow } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'
import { mapState } from 'vuex'
import router from '@/router/'
export default {
  name: 'ArticleIndex',
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  props: {
    // 动态路由的用法
    articleId: {
      type: [Number, String], // 因为使用大数字转换
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      isFollowLoading: false, // 关注loading
      isPostShow: false, // 评论弹出层
      CommentList: [], // 文章评论列表
      totalCommentCount: 0, // 文章评论总数
      isReplyShow: false, // 控制回复的显示状态
      replyComment: {} // 当前回复评论对象
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    // 从服务器加载文章内容
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data

      // 数据更新不会立即影响到视图dom故而需要放到$nestTick()中
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },

    // 图片预览功能函数
    handlePerviewImage () {
      // 1.获取文章内容dom容器
      const articleContent = this.$refs['article-content']
      // 2.得到所有的img标签.
      const imgs = articleContent.querySelectorAll('img')
      // 3.遍历所有img节点
      const imgPaths = [] // 先定义一个图片地址的空数组
      imgs.forEach((img, index) => { // 遍历数组
        imgPaths.push(img.src) // 每遍历一个就给空数组追加一个地址
        img.onclick = function () { // 给每个节点注册点击事件
          ImagePreview({ // 调用图片预览函数
            images: imgPaths, // 把domo里写死的地址换成imgPaths
            startPosition: index, // 图片预览起始位置索引
            showIndex: true, // 是否显示页码
            showIndicators: true // 是否显示轮播指示器
          })
        }
      })
    },

    // 关注用户
    async onFollow () {
      // 开启loading
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注，就取消关注
        await deleteFollow(this.article.art_id)
      } else {
        // 未关注，则关注
        await addFollow(this.article.art_id)
      }
      // 每点击一次就取反
      this.article.is_followed = !this.article.is_followed
      // 关闭loading
      this.isFollowLoading = false
    },

    // 收藏文章
    async onCollect () {
      // 开启loading
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.user) {
        if (this.article.is_collected) {
          // 已收藏，就取消收藏
          await deleteCollect(this.article.art_id.toString())
        } else {
          // 未收藏，则收藏
          await addCollect(this.article.art_id.toString())
        }
        // 每点击一次就取反
        this.article.is_collected = !this.article.is_collected
        this.$toast.success(this.article.is_collected ? '收藏成功' : '取消收藏')
      } else {
        this.$toast.fail('请先登录账号')
        // 去到登录页
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }
    },

    // 点赞文章
    async onLike () {
      // 开启loading
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      if (this.user) {
        if (this.article.attitude === 1) {
          // 已点赞，就取消点赞
          await deleteLike(this.article.art_id.toString())
          // 每点击一次就改变
          this.article.attitude = -1
        } else {
          // 未点赞，则点赞
          await addLike(this.article.art_id.toString())
          // 每点击一次就改变
          this.article.attitude = 1
        }
        this.$toast.success(this.article.attitude === 1 ? '点赞成功' : '取消点赞')
      } else {
        this.$toast.fail('请先登录账号')
        // 去到登录页
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }
    },

    // 处理发布结果
    onPostSuccess (comment) {
      // 将最新发布的评论展示到列表的顶部
      this.CommentList.unshift(comment)
      // 关闭发布评论的弹层
      this.isPostShow = false
      // 更新评论总数
      this.totalCommentCount++
    },

    // 回复评论
    onReplyClick (comment) {
      this.isReplyShow = true // 显示弹出层
      this.replyComment = comment
    }
  }
}
</script>

<style scoped lang='less'>
.article-container{
    .article-wrap{
      position: fixed;
      left: 0;
      right: 0;
      top: 46px;
      bottom: 50px;
      overflow-y: auto;
      .title{
          font-size: 20px;
          color: #3a3a3a;
          padding: 14px;
          text-align: justify;
          background-color: #fff;
          margin: 0;
      }
      .van-cell::after{
          border-bottom: none;
      }
      .user-info{
          .avatar{
              width: 36px;
              height: 36px;
              margin-right: 8px;
          }
          .name{
              font-size: 14px;
              color: #333;
          }
          .pubdate{
              font-size: 12px;
              color: #b4b4b4;
          }
          .follow-btn{
              width: 85px;
              height: 29px;
          }
          .van-cell__label{
              margin-top: 0;
          }
      }
      .content{
          text-align: justify;
          text-indent: 2em;
          padding: 14px;
          background-color: #fff;
      }
    }
    // 底部区域
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
        width: 160px;
        .van-button__text{
          color: #333;
        }
      }
      .van-icon {
        font-size: 20px;
      }
      .comment-icon {
        bottom: -2px;
      }
      .share-icon {
        bottom: -2px;
      }
    }
    .finish{
      text-align: center;
      color: #b4b4b4;
    }
}
</style>
