import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const DESTINATIONS = [
  {
    name: "Sigiriya Rock Fortress",
    location: "Cultural Triangle",
    category: "Heritage",
    emoji: "🏛",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-400/20"
  },
  {
    name: "Mirissa Beach",
    location: "Southern Coast",
    category: "Beach",
    emoji: "🏖",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-400/20"
  },
  {
    name: "Yala National Park",
    location: "Southern Province",
    category: "Wildlife",
    emoji: "🐘",
    color: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-400/20"
  },
  {
    name: "Ella Hill Country",
    location: "Uva Province",
    category: "Adventure",
    emoji: "🌿",
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-green-400/20"
  },
  {
    name: "Temple of the Tooth",
    location: "Kandy",
    category: "Cultural",
    emoji: "🛕",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-400/20"
  },
  {
    name: "Unawatuna Bay",
    location: "Galle District",
    category: "Beach",
    emoji: "🌊",
    color: "from-teal-500/20 to-cyan-500/20",
    border: "border-teal-400/20"
  }
]

const STATS = [
  { value: "50+", label: "Tour Packages" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "25+", label: "Destinations" },
  { value: "4.9★", label: "Average Rating" }
]

const FEATURES = [
  {
    icon: "🗺",
    title: "Curated Sri Lanka Tours",
    desc: "Handpicked itineraries covering beaches, ancient cities, wildlife, and tea country across the island."
  },
  {
    icon: "💳",
    title: "Flexible LKR Payments",
    desc: "Pay 30% advance to reserve your spot. Admin confirms, then pay the 70% balance at your convenience."
  },
  {
    icon: "🤖",
    title: "AI Travel Assistant",
    desc: "Powered by Groq · Llama 3. Get personalized destination recommendations and itinerary advice instantly."
  },
  {
    icon: "🔒",
    title: "Secure & Transparent",
    desc: "JWT-authenticated accounts, role-based access, and a full payment history you can track anytime."
  }
]

// Animated counter hook
const useCounter = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

const Home = () => {
  const navigate = useNavigate()
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-slate-950 text-sm font-black">VL</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight leading-none">VoyaLink</span>
              <p className="text-emerald-400 text-[10px] leading-none tracking-widest uppercase">Sri Lanka Tours</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white text-sm px-4 py-2 rounded-xl hover:bg-white/5 transition font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28">
        {/* Background glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 text-xs font-medium mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sri Lanka's Premier Tour Booking Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Discover the
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Pearl of the Indian Ocean
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Book handcrafted tour packages across Sri Lanka — from ancient rock fortresses
            to pristine beaches and misty hill country. Flexible LKR payments, AI travel
            guidance, and a seamless booking experience.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 text-base font-bold text-slate-950 hover:opacity-90 transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <span>Start Exploring</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/20 transition flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
            </button>
          </div>

          {/* Floating destination pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {["🏖 Beaches", "🏔 Ella", "🐘 Yala", "🏛 Sigiriya", "🛕 Kandy", "🌿 Tea Trails", "🌊 Galle"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-slate-400 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        ref={statsRef}
        className="border-y border-white/10 bg-slate-900/50 px-6 py-12"
      >
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS GRID ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-emerald-400 uppercase tracking-[0.25em] text-xs font-semibold mb-3">
              Popular Destinations
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore Sri Lanka's Wonders
            </h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">
              From sun-drenched coastlines to mist-wrapped mountains, every corner of Sri Lanka tells a story.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DESTINATIONS.map((dest, i) => (
              <div
                key={dest.name}
                onClick={() => navigate("/register")}
                className={`group relative rounded-2xl border ${dest.border} bg-gradient-to-br ${dest.color} p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <span className="text-4xl">{dest.emoji}</span>
                  <div className="mt-4">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-300">
                      {dest.category}
                    </span>
                    <h3 className="mt-2 font-semibold text-white">{dest.name}</h3>
                    <p className="text-slate-400 text-xs mt-1">📍 {dest.location}</p>
                  </div>
                  <div className="mt-4 text-xs text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition">
                    Book this tour →
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/register")}
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              View All Tour Packages →
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-20 bg-slate-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs font-semibold mb-3">
              Why VoyaLink
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need for a Perfect Trip
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-slate-900 p-7 hover:border-emerald-400/20 transition"
              >
                <span className="text-4xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-emerald-400 uppercase tracking-[0.25em] text-xs font-semibold mb-3">
              Simple Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Book in 4 Easy Steps</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                step: "01",
                icon: "👤",
                title: "Create Your Account",
                desc: "Sign up in seconds with your email. Secure JWT authentication keeps your data safe.",
                color: "text-cyan-400",
                border: "border-cyan-400/20"
              },
              {
                step: "02",
                icon: "🌍",
                title: "Browse & Choose a Tour",
                desc: "Explore curated Sri Lanka packages filtered by category, location, or budget.",
                color: "text-emerald-400",
                border: "border-emerald-400/20"
              },
              {
                step: "03",
                icon: "💳",
                title: "Pay 30% Advance in LKR",
                desc: "Reserve your spot with a 30% advance payment. Admin reviews and confirms your booking.",
                color: "text-purple-400",
                border: "border-purple-400/20"
              },
              {
                step: "04",
                icon: "🏖",
                title: "Pay Balance & Travel",
                desc: "Once confirmed, pay the remaining 70% balance and get ready for your Sri Lanka adventure!",
                color: "text-pink-400",
                border: "border-pink-400/20"
              }
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-2xl border ${item.border} bg-slate-900 p-7 relative overflow-hidden`}
              >
                <span
                  className={`absolute top-4 right-5 text-5xl font-black opacity-10 ${item.color}`}
                >
                  {item.step}
                </span>
                <span className="text-3xl">{item.icon}</span>
                <h3 className={`mt-4 font-semibold ${item.color}`}>{item.title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="px-6 py-20 bg-slate-900/30">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 p-10 md:p-14 text-center">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 text-3xl mb-6 mx-auto">
                🤖
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-purple-300 text-xs font-medium mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                Powered by Groq · Llama 3
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Your AI Travel Guide
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed mb-8">
                Not sure where to go in Sri Lanka? Ask VoyaLink AI for personalized
                destination picks, itinerary suggestions, local tips, and LKR budget
                planning — all in real time.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs">
                {[
                  "Best beaches for snorkelling 🤿",
                  "3-day Kandy itinerary 🏔",
                  "Budget under LKR 30,000 💰",
                  "Family-friendly tours 👨‍👩‍👧"
                ].map((q) => (
                  <span
                    key={q}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-400"
                  >
                    {q}
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate("/register")}
                className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white hover:opacity-90 transition shadow-xl shadow-purple-500/20"
              >
                Try AI Travel Guide →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-12 md:p-16">
            <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-5xl mb-5">🌴</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Your Sri Lanka
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Adventure Awaits
                </span>
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Join thousands of travelers who've discovered the magic of Sri Lanka
                through VoyaLink. Create your free account and start planning today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-10 py-4 font-bold text-slate-950 hover:opacity-90 transition shadow-xl shadow-emerald-500/20 text-sm"
                >
                  Create Free Account →
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-10 py-4 font-semibold text-white hover:bg-white/10 transition text-sm"
                >
                  Already have an account?
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 text-xs font-black">VL</span>
            </div>
            <span className="font-bold text-sm tracking-tight">VoyaLink</span>
          </div>
          <p className="text-slate-500 text-xs text-center">
            © 2025 VoyaLink · Sri Lanka's Premier Tour Booking Platform
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button onClick={() => navigate("/login")} className="hover:text-slate-300 transition">Login</button>
            <span>·</span>
            <button onClick={() => navigate("/register")} className="hover:text-slate-300 transition">Register</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home