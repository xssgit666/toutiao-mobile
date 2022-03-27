import request from '@/utils/request'

// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 添加频道传到线上
export const addUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels
    }
  })
}

// 删除频道传到线上
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
