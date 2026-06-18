import api from "./api"

export const createPost = async (data: any) => {
  const res = await api.post("/post/create", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return res.data
}

export const getAllPosts = async (page: number, limit: number) => {
  const res = await api.get(`/post?page=${page}&limit=${limit}`)
  return res.data
}

export const getMyPosts = async (page: number, limit: number) => {
  const res = await api.get(`/post/me?page=${page}&limit=${limit}`)
  return res.data
}