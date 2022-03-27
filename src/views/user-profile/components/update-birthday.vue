<template>
  <div class='update-birthday'>
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择您的生日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs' // 在非组件中使用需要单独引用
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm (value) { // value: 当前选中的时间
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true
      })
      // dayjs方法.format格式化日期
      const valueLocal = dayjs(value).format('YYYY-MM-DD')
      await updateUserProfile({
        birthday: valueLocal
      })
      this.$emit('input', valueLocal)
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'>

</style>
