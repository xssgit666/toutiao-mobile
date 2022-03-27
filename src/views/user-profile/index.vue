<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      title="个人信息"
      @click-left="$router.back()"
    ></van-nav-bar>

    <!-- 头像 -->
    <input
      type="file"
      hidden
      ref="file"
      accept="image/jpeg,image/png"
      @change="onFileChange"
    >
    <van-cell
      class="user-photo"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-popup
      class="update-photo-popup"
      v-model="isEditPhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-photo
        v-if="isEditPhotoShow"
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>

    <!-- 昵称 -->
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    ></van-cell>
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-name
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow = false"
      />
    </van-popup>

    <!-- 性别 -->
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isEditGenderShow = true"
    ></van-cell>
    <van-popup
      v-model="isEditGenderShow"
      position="bottom"
    >
      <update-gender
        v-if="isEditGenderShow"
        v-model="user.gender"
        @close="isEditGenderShow = false"
      />
    </van-popup>

    <!-- 生日 -->
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthdayShow = true"
    ></van-cell>
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-if="isEditBirthdayShow"
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  components: {
    UpdateName, // 昵称组件
    UpdateGender, // 性别组件
    UpdateBirthday, // 生日组件
    UpdatePhoto // 头像弹框
  },
  props: [],
  data () {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称的显示状态
      isEditGenderShow: false, // 性别选择弹框
      isEditBirthdayShow: false, // 生日弹框
      isEditPhotoShow: false, // 用户头像
      previewImage: null // 预览图片
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange () {
      this.isEditPhotoShow = true // 显示弹出层
      this.previewImage = this.$refs.file.files[0] // 获取选取的本地文件地址
      this.$refs.file.value = '' // 解决相同文件不触发，清除file
    }
  }
}
</script>

<style scoped lang='less'>
.user-photo{
  /deep/ .van-cell__value{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .van-image{
      width: 35px;
      height: 35px;
    }
  }
}
.van-popup{
  background-color: #F5F7F9;
}
.update-photo-popup{
  background-color: #000;
  display: flex;
  align-items: center;
}
</style>
