<template>
  <div class='my-container'>
    <!-- 顶部已登录 -->
    <van-cell-group v-if="user" class="my-info">
      <!-- 头像资料 -->
      <van-cell
        class="base-info"
        center
        :border="false"
      >
        <van-image
          class="avater"
          slot="icon"
          round
          fit="cover"
          :src="admin.photo"
        />
        <div class="name" slot="title">{{admin.name}}</div>
        <van-button
          class="uodate-btn"
          size="small"
          round
          to="/user/profile"
        >编辑资料</van-button>
      </van-cell>
      <!-- 用户数据 -->
      <van-grid class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="span">{{admin.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="span">{{admin.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="span">{{admin.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="span">{{admin.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 顶部未登录 -->
    <div v-else class="not-login">
      <div @click="$router.push({
        name: 'login',
        query: {
          redirect: '/my'
        }
      })">
        <img class="mobile" src="./mobile.png" alt="">
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <!-- 中部 -->
    <van-grid class="nav-grid mb-10" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="icon"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="icon"
        icon="lishi"
        text="历史"
      />
    </van-grid>
    <!-- 底部 -->
    <van-cell title="消息通知" is-link to="/" />
    <van-cell
      class="mb-10"
      title="小智同学"
      is-link
      to="/user/chat"
    />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: [],
  data () {
    return {
      admin: {} // 当前登录用户信息
    }
  },
  computed: {
    // 注意：映射来的user不能和data里的重名
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadCurrentUser()
  },
  mounted () {},
  methods: {
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.admin = data.data
    },
    onLogout () {
      // 提示用户是否确认退出。.dialog方法可不引用通过this.调用
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => { // 确认后执行
          // 清除用户登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang='less'>
.my-container{
  // 顶部已登录样式
  .my-info{
    background: url("./banner.png") no-repeat;
    background-size: cover;
    // 头像资料样式
    .base-info{
      box-sizing: border-box;
      height: 115px;
      padding-top: 38px;
      padding-bottom: 11px;
      background-color: transparent;
      .avater{
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        margin-right: 11px;
        border: 3px solid #fff;
      }
      .name{
        color: #fff;
        font-size: 15px;
      }
      .uodate-btn{
        height: 24px;
        padding: 5px 10px;
        font-size: 12px;
        color: #666;
      }
    }
    // 用户资料样式
    .data-info{
      .data-info-item{
        color: #fff;
        height: 65px;
        text-align: center;
        .span{
          font-size: 18px;
          font-weight: bolder;
        }
        .text{
          font-size: 12px;
        }
      }
    }
    /deep/ .van-grid-item__content{
      background-color: transparent;
    }
  }
  //顶部未登录样式
  .not-login{
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile{
      width: 66px;
      height: 66px;
    }
    .text{
      font-size: 14px;
      color: #fff;
    }
  }

  // 中部样式
  /deep/ .nav-grid{
    .nav-grid-item{
      height: 70px;
      .icon{
        font-size: 23px;
      }
      .icon-shoucang{
        color: #eb5253;
      }
      .icon-lishi{
        color: #ff9d1d;
      }
      .van-grid-item__text{
        font-size: 14px;
        margin-top: 4px;
      }
    }
  }

  // 底部样式
  .van-cell__title{
    font-size: 15px;
  }
  .logout-cell{
    text-align: center;
    color: #d86262;
  }

  // 底部外边距4px 类名
  .mb-10{
    margin-bottom: 10px;
  }
}
</style>
