import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getAIRecommendation } from "../service/ai"

type Message = {
  role: "user" | "assistant"
  content: string
}

const QUICK_PROMPTS = [
  "Recommend a beach tour under $200",
  "I want a 5-day adventure trip",
  "Best cultural tours available",
  "Wildlife safari for a family of 4",
  "Most affordable tours right now",
  "Something unique and off the beaten path"
]

const AIRecommendation = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your VoyaLink AI travel assistant 🌍\n\nTell me what kind of trip you're dreaming of — your budget, interests, travel dates, or group size — and I'll find the perfect tour for you!"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMessage: Message = { role: "user", content: trimmed }

    // Add user message immediately to UI
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Build history: exclude the welcome message, take last 8 exchanges
      const history = [...messages].slice(1).slice(-8)

      const result = await getAIRecommendation(trimmed, history)

      const aiMessage: Message = {
        role: "assistant",
        content: result.data.response
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment. 😔"
        }
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared! 🌟 Tell me what kind of trip you're looking for and I'll find the perfect tour for you."
      }
    ])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4 flex-shrink-0">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VV</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
          </div>

          <div className="flex items-center gap-3">
            {/* AI badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-medium">Groq AI</span>
            </div>
            <button
              onClick={handleClearChat}
              className="text-slate-400 hover:text-white text-xs px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Clear chat
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto w-full max-w-5xl px-6 py-8 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-semibold">
            Powered by Groq AI · llama3-70b
          </p>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold">AI Travel Recommender</h1>
          <p className="text-slate-400 text-sm mt-1">
            Ask anything — get personalized tour recommendations from our catalog
          </p>
        </div>

        {/* Quick prompts */}
        <div className="mb-5">
          <p className="text-slate-500 text-xs mb-2">Quick prompts:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-xs text-slate-300 hover:border-emerald-400/40 hover:text-emerald-300 hover:bg-slate-800 transition disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat messages container */}
        <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900 p-5 overflow-y-auto min-h-[380px] max-h-[460px] space-y-5 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-cyan-500 to-emerald-500"
                    : "bg-slate-700"
                }`}
              >
                {msg.role === "assistant" ? (
                  <span className="text-slate-950 text-xs font-black">AI</span>
                ) : (
                  <span className="text-white text-xs font-semibold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-medium rounded-tr-sm"
                    : "bg-slate-800 border border-white/10 text-slate-200 rounded-tl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing / loading indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-slate-950 text-xs font-black">AI</span>
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-800 border border-white/10 px-5 py-4">
                <div className="flex gap-1.5 items-center">
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            placeholder="Ask for tour recommendations... (Press Enter to send)"
            disabled={loading}
            className="flex-1 rounded-2xl bg-slate-900 border border-slate-700 px-5 py-3.5 text-sm outline-none focus:border-emerald-400 transition disabled:opacity-50 placeholder:text-slate-500"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3.5 font-semibold text-slate-950 hover:opacity-90 transition disabled:opacity-40 text-sm flex-shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-bounce" />
                <span>...</span>
              </span>
            ) : (
              "Send →"
            )}
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs mt-3">
          AI recommendations are based on available VoyaLink tours · Powered by Groq
        </p>
      </div>
    </div>
  )
}

export default AIRecommendation