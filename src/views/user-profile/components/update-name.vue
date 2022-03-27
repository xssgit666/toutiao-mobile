<template>
  <div class='update-name'>
    <!-- 导航栏 -->
    <van-nav-bar
      left-text="取消"
      right-text="完成"
      title="修改昵称"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>

    <!-- 输入框 -->
    <div class="name-field-wrap">
      <van-field
        class="name-field"
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入您的新昵称"
        show-word-limit
      />
    </div>
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.value // 输入框内容
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true
      })
      try {
        await updateUserProfile({
          name: this.localName
        })
        this.$emit('input', this.localName)
        this.$emit('close')
        this.$toast.success('保存成功')
      } catch (error) {
        if (error && error.response && error.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.name-field-wrap{
  padding: 14px;
  .name-field{
    border-radius: 10px;
  }
}
</style>
