<template>
  <div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
        v-else
        name="delete"
        @click="isDeleteShow = true"
      />
    </van-cell>
    <van-cell
      center
      v-for="(history, index) in searchHistories"
      :key="index"
      :title="history"
      @click="onDelete(history,index)"
    >
      <van-icon
        v-show="isDeleteShow"
        name="close"
      />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 删除的显示状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onDelete (history, index) {
      // 如果是删除状态
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 更新历史记录至本地
        setItem('search-histories', this.searchHistories)
      } else {
        // 如果非删除状态，则进入搜索
        this.$emit('search', history)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-cell__title{
  text-align: justify;
}
.van-cell__value{
  flex: unset;
  .van-icon-close{
    margin-left: 10px;
  }
}
</style>
