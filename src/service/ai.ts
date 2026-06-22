import api from "./api"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export const getAIRecommendation = async (
  message: string,
  chatHistory: ChatMessage[] = []
) => {
  const res = await api.post("/ai/recommend", { message, chatHistory })
  return res.data
}

export const getMyAIHistory = async () => {
  const res = await api.get("/ai/history/my")
  return res.data
}

export const getAdminAILogs = async () => {
  const res = await api.get("/ai/logs/all")
  return res.data
}