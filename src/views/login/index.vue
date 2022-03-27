<template>
  <div class='login-container'>

    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 登录表单 -->
    <div class="login-form">
      <van-form
        ref='login-form'
        validate-first
        :show-error="false"
        :show-error-message="false"
        @submit="onLogin"
        @failed='onFailed'
      >
        <van-field
          center
          name="mobile"
          v-model="user.mobile"
          icon-prefix="icon"
          left-icon="shouji"
          placeholder="请输入手机号"
          :rules="formRules.mobile"
        />
        <van-field
          center
          v-model="user.code"
          clearable
          icon-prefix="icon"
          left-icon="yanzhengma"
          placeholder="请输入验证码"
          :rules="formRules.code"
        >
          <template #button>
            <van-count-down
            v-if="isCountDownShow"
              :time="1000 * 60"
              format="ss s"
              @finish='isCountDownShow = false'
            />
            <van-button
              v-else
              class="send-btn"
              size="small"
              round
              :loading='isSendSmsLoading'
              native-type="button"
              @click="onSendSms"
            >获取验证码</van-button>
          </template>
        </van-field>

        <!-- 登录 -->
        <div class="login-btn-wrap">
          <van-button
            class="login-btn"
            type="info"
            block
            native-type="submit"
          >登录</van-button>
        </div>
      </van-form>
    </div>

    <!-- 提示登录文本 -->
    <div class="ts">
      <div class="tishi">
        <p>若输入手机号点击后接收不到验证码，可使用万能验证码 <span>246810</span>登录。</p>
        <p class="title">测试账号</p>
        <p>账号：<span>13911111111</span></p>
        <p>验证码：<span>246810</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  components: {},
  props: [],
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号格式' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 点击后调用的数据请求函数
    async onLogin () {
      // 登录中提示，使用需单独加载
      Toast.loading({
        message: '加载中...', // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0 // 值为 0 时，toast 不会消失
      })
      // 请求调用登录
      try {
        const { data } = await login(this.user) // 解构赋值
        Toast.success('登陆成功') // 登陆成功提示
        // 将后端返回的用户登录状态（token等）放到Vuex容器中
        this.$store.commit('setUser', data.data)

        // 最后期优化:清除layout的缓存，让他重新渲染
        this.$store.commit('removeCachePage', 'LayoutIndex')

        // 登录成功后，页面跳转回原页面--暂时先用此方法
        // this.$router.back()
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        console.log(err)
        Toast.fail('登录失败,手机号或验证码错误') // 登陆失败提示
      }
    },

    // 提交表单且验证不通过后触发该函数
    onFailed (error) { // 函数返回内容可控制台打印查看并使用
      if (error.errors[0]) {
        Toast({
          message: error.errors[0].message,
          position: 'top' // 定位提示框位置
        })
        if (error.errors[1]) {
          Toast({
            message: error.errors[1].message, // 提示消息
            position: 'top' // 定位提示框位置
          })
        }
      }
    },

    // 点击发送验证码函数
    async onSendSms () {
      try {
        // 验证手机号，通过ref和validate('给验证项加的name')
        await this.$refs['login-form'].validate('mobile')
        // 验证码按钮loading状态打开
        this.isSendSmsLoading = true
        // 验证通过后,开始调用接口请求发送验证码
        await sendSms(this.user.mobile)
        // 短信发出后，隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        // 验证失败后的提示，需对提示内容做一个判断
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的提示
          message = err.message
        } else {
          // 未知错误的提示
          message = '发送失败，请稍后重试'
        }
        // 提示用户
        Toast({
          message, // 提示消息
          position: 'top' // 定位提示框位置
        })
      }
      // 验证码按钮loading状态关闭
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang='less'>
.login-container{
  .login-form{
    padding: 26px 16px 0;
    .login-btn-wrap{
      padding: 26px 0;
      .login-btn{
        border: none;
        .van-button__text{
          font-size: 15px;
        }
      }
    }
    .send-btn{
      height: 23px;
      background-color: #ededed;
      .van-button__text{
        font-size: 11px;
        color: #666;
      }
    }
  }
  .ts{
    padding: 0 16px;
    .tishi{
      padding: 16px;
      background-color: #fff;
      color: #000;
      font-size: 14px;
      text-align: justify;
      text-indent: 2em;
      border-radius: 10px;
      span{
        margin: 0 5px;
        font-weight: bolder;
        color: #1989fa;
      }
      p{
        margin: 0;
      }
      .title{
        font-weight: bolder;
        margin: 10px 0 5px;
      }
    }
  }
}
</style>
