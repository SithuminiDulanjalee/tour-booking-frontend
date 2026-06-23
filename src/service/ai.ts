import api from "./api"

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export const getAIRecommendation = async (messages: ChatMessage[]) => {
  const res = await api.post("/ai/recommend", { messages })
  return res.data
}