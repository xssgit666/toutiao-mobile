/**
 * 评论相关请求模块
 */
import request from '@/utils/request'

// 获取用户评论列表
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

// 对评论或评论回复点赞
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target // 评论ID
    }
  })
}

// 取消对评论或评论回复点赞
export const deleteCommentLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${commentId}`
  })
}

// 对文章或者评论进行评论
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
