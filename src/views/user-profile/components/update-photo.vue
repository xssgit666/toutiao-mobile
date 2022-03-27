<template>
  <div class='update-photo'>
    <img class="image" :src="image" ref="image">

    <van-nav-bar
        class="toolbar"
        left-text="取消"
        right-text="完成"
        @click-left="$emit('close')"
        @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    file: {
      type: null, // 任何类型都可以
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 50000,
        overlay: true
      })
      const file = await this.getCroppedCanvas()
      // 接口要求必须传入一个FormData对象才行
      const fd = new FormData()
      // 通过append方法追加参数名称是photo的file文件
      fd.append('photo', file)
      await updateUserPhoto(fd) // 调接口发送请求
      this.$emit('update-photo', window.URL.createObjectURL(file)) // 更新父组件信息
      this.$emit('close') // 关闭弹框
      this.$toast.success('保存成功') // 提示保存成功
    }
  }
}
</script>

<style scoped lang='less'>
.toolbar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    /deep/ .van-nav-bar__text{
      color: #fff;
    }
}
.image{
  display: block;
  max-width: 100%;
}
</style>
