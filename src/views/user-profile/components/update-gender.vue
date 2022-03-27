<template>
  <div class='update-gender'>
    <van-picker
      title="请选择您的性别"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女']
      // 后端索引和前端Picker组件索引恰好对应，用组件的index亦可，故而不再做prop本地赋值，向父组件传值时传送Picker组件的index即可
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm (value, index) { // 虽只用index,前面的value也要传
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true
      })
      await updateUserProfile({
        gender: index
      })
      this.$emit('input', index)
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'>

</style>
