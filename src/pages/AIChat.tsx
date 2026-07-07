import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ChatMessage, getAIRecommendation } from "../service/ai"

const STORAGE_KEY = "voyalink_ai_chat"

const SUGGESTIONS = [
  "Best beaches in Sri Lanka 🏖",
  "3-day itinerary for Kandy 🏔",
  "Wildlife safari options in Yala 🐘",
  "Budget trip under LKR 50,000 💰",
  "Best time to visit Sri Lanka 🌦",
  "Ancient cities — Sigiriya & Polonnaruwa 🏛"
]

const loadFromStorage = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

const saveToStorage = (messages: ChatMessage[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
}

const clearStorage = () => {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const isUser = msg.role === "user"
  const formatContent = (text: string) =>
    text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className={i > 0 ? "mt-1" : ""}>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold text-white">{part}</strong>
            ) : (
              part
            )
          )}
        </p>
      )
    })

  return (
    <div className={`flex gap-2 md:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-xl flex items-center justify-center text-sm ${
          isUser
            ? "bg-gradient-to-br from-cyan-500 to-emerald-500 text-slate-950 font-bold"
            : "bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-400/30"
        }`}
      >
        {isUser ? "U" : "🤖"}
      </div>
      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/20 text-white rounded-tr-sm"
            : "bg-slate-800 border border-white/10 text-slate-300 rounded-tl-sm"
        }`}
      >
        {formatContent(msg.content)}
      </div>
    </div>
  )
}

const TypingIndicator = () => (
  <div className="flex gap-2 md:gap-3">
    <div className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-400/30 flex items-center justify-center text-sm">
      🤖
    </div>
    <div className="bg-slate-800 border border-white/10 rounded-2xl rounded-tl-sm px-3 md:px-4 py-2.5 md:py-3">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
)

const AIChat = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadFromStorage())
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { saveToStorage(messages) }, [messages])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    const content = text.trim()
    if (!content || loading) return
    setError("")
    setInput("")
    const userMessage: ChatMessage = { role: "user", content }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveToStorage(updatedMessages)
    setLoading(true)
    try {
      const res = await getAIRecommendation(updatedMessages)
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: res.data.reply
      }
      setMessages((prev) => {
        const next = [...prev, assistantMessage]
        saveToStorage(next)
        return next
      })
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      )
      setMessages(messages)
      saveToStorage(messages)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleClear = () => {
    if (messages.length === 0) return
    if (confirm("Clear this conversation? Chat history will be removed from this device.")) {
      clearStorage()
      setMessages([])
      setError("")
      setMenuOpen(false)
    }
  }

  const isNew = messages.length === 0

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-4 md:px-6 py-4 flex-shrink-0">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VL</span>
            </div>
            <span className="font-bold text-lg tracking-tight">VoyaLink</span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Groq AI · Llama 3
            </div>
            {messages.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/5 px-3 py-1.5 text-cyan-400 text-xs">
                💾 Saved locally
              </div>
            )}
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
              >
                🗑 Clear Chat
              </button>
            )}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              ← Dashboard
            </button>
          </div>

          {/* Mobile: badge + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1.5 text-emerald-300 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Groq AI</span>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl hover:bg-white/5 transition text-white"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="border-t border-white/10 bg-slate-900/98 px-4 py-3 space-y-2">
            {messages.length > 0 && (
              <div className="text-cyan-400 text-xs px-2 py-1">
                💾 {messages.length} message{messages.length !== 1 ? "s" : ""} saved locally
              </div>
            )}
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-300 hover:bg-red-500/10 transition"
              >
                🗑 Clear Chat
              </button>
            )}
            <button
              onClick={() => { navigate("/dashboard"); setMenuOpen(false) }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-5 md:py-6">

          {/* Welcome screen */}
          {isNew && (
            <div className="mb-6 md:mb-8">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 text-2xl md:text-3xl mb-4">
                  🤖
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  VoyaLink AI Assistant
                </h1>
                <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
                  Powered by Groq · Llama 3. Your personal Sri Lanka travel guide.
                </p>
                <div className="mt-3 flex items-center justify-center">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/5 px-3 py-1 text-cyan-400 text-xs">
                    💾 Chats saved in your browser until cleared
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                  {["🏖 Beaches", "🏔 Hills", "🐘 Wildlife", "🏛 Heritage", "💰 LKR Budgets"].map(
                    (t) => (
                      <span key={t} className="rounded-full border border-white/10 px-3 py-1">
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>

              <p className="text-slate-400 text-xs uppercase tracking-wider text-center mb-4">
                Try asking
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-2xl border border-white/10 bg-slate-900 px-4 md:px-5 py-3 md:py-4 text-sm text-left text-slate-300 hover:border-emerald-400/30 hover:bg-slate-800 hover:text-white transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isNew && (
            <div className="mb-4 md:mb-5 flex items-center justify-between">
              <p className="text-slate-500 text-xs">
                💾 {messages.length} message{messages.length !== 1 ? "s" : ""} saved
              </p>
              <p className="text-slate-600 text-xs hidden sm:block">
                Scroll up to see full conversation
              </p>
            </div>
          )}

          {messages.length > 0 && (
            <div className="space-y-4 md:space-y-5 pb-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
              {error && (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                  ⚠️ {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
          {isNew && <div ref={bottomRef} />}
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-white/10 bg-slate-900/90 backdrop-blur px-4 md:px-6 py-3 md:py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-2 md:gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Sri Lanka travel..."
                rows={1}
                disabled={loading}
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-emerald-400 transition resize-none disabled:opacity-50 max-h-32"
                style={{ lineHeight: "1.5" }}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement
                  el.style.height = "auto"
                  el.style.height = Math.min(el.scrollHeight, 128) + "px"
                }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 md:h-5 md:w-5"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-2 text-center">
            Enter to send · Shift+Enter for new line · Powered by Groq · Saved in browser
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIChat