<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell center :border="false">
      <div
        slot="title"
        class="channel-title"
      >我的频道</div>
      <div
        slot="default"
        class="channel-btn"
        @click="isEdit=!isEdit"
      >{{isEdit ? '完成' : '编辑'}}</div>
    </van-cell>
    <van-grid :gutter="10" class="mb-17">
      <van-grid-item
        class="channel-item"
        :class="{active: index === active}"
        :icon="isEdit  && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel,index)"
      />
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell center :border="false">
      <div
        slot="title"
        class="channel-title"
      >频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false // 控制编辑的显示状态
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐的频道列表：推荐频道 = 所有频道 - 用户频道
    recommendChannels () {
      // 遍历所有频道，对每一个频道都判断
      return this.allChannels.filter(item => {
        // 返回两个频道ID不相同的频道
        return !this.userChannels.find(userItem => userItem.id === item.id)
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    // 获取所有频道
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 频道推荐点击添加到我的频道
    async onAdd (channel) {
      this.userChannels.push(channel)

      // 数据持久化
      if (this.user) { // 登陆了，数据存储在线上
        await addUserChannel([{
          id: channel.id, // 频道 id
          seq: this.userChannels.length // 频道的 序号
        }])
      } else { // 没有登录，储存在本地
        setItem('channels', this.userChannels)
      }
    },
    // 我的频道的操作
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) { // 如果是编辑状态，则删除频道
        this.deleteChannel(channel, index)
      } else { // 如果是非编辑状态，则切换频道
        this.switchChannel(index)
      }
    },
    // 删除频道函数
    async deleteChannel (channel, index) {
      if (index <= this.active) { // 如果删除的是当前激活频道之前的频道
        // 则$emit发射通知父组件active要减1了。父减了1，再传回来减了1的active
        this.$emit('update-active', this.active - 1)
      }
      // 数组的splice方法，传俩值，从index开始，删去1个，不传1则删后面的全部
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (this.user) { // 登陆了，数据存储在线上
        await deleteUserChannel(channel.id)
      } else { // 没有登录，储存在本地
        setItem('channels', this.userChannels)
      }
    },
    // 切换频道
    switchChannel (index) {
      // 父子间通信：子向父发射一个事件xx，父监听处理@xx=""使用即可
      this.$emit('update-active', index)
      this.$emit('close') // 关闭弹出层
    }
  }
}
</script>

<style scoped lang='less'>
.channel-edit{
  padding-top: 54px;
  .channel-title{
    font-size: 16px;
    color: #333;
  }
  .channel-btn{
    color: #1989fa;
    font-size: 14px;
  }
  .channel-item{
    /deep/ .van-grid-item__content{
      position: relative;
      height: 43px;
      border-radius: 5px;
      background-color: #F4F5F6;
      .van-icon{
        position: absolute;
        right: -5px;
        top:-5px;
        font-size: 15px;
        color: #ee0a24;
      }
      .van-grid-item__text{
        color: #222;
        font-size: 13px;
        margin-top: 0;
      }
    }
  }
  .active{
    /deep/ .van-grid-item__content{
      .van-grid-item__text{
        color: #1989fa;
      }
    }
  }
  .mb-17{
    margin-bottom: 17px;
  }
}
</style>
