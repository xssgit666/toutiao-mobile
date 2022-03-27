<template>
  <div class='user-chat'>
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 消息列表 -->
    <van-cell-group class="message-list">
      <van-cell title="接口跨域，暂时放弃..."/>
    </van-cell-group>

    <!-- 发送消息 -->
    <van-cell-group class="send-message-wrap">
      <van-field
        class="send-text"
        v-model="message"
        placeholder="请输入消息内容"
        :border="false"
      />
      <van-button
        class="send-btn"
        size="small"
        round
        type="info"
      >发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
// import io from 'socket.io-client'
// 建立连接
// const socket = io('http://toutiao.itheima.net')
// 当客户端与服务器建立连接成功，触发 connect 事件
// socket.on('connect', () => {
//   console.log('连接成功了')
// })
// 当客户端与服务器建立连接成功，触发 disconnect 事件
// socket.on('disconnect', () => {
//   console.log('取消连接了')
// })

export default {
  name: 'UserChat',
  components: {},
  props: [],
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang='less'>
.message-list{
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 60px;
    overflow-y: auto;
}
.send-message-wrap{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 8px 14px;
    .send-text{
        border-radius: 5px;
        background-color: #F5F7F9;
        margin-right: 10px;
    }
    .send-btn{
        width: 60px;
        height: 28px;
    }
}
</style>
