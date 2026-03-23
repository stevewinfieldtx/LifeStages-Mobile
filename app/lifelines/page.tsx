"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LifelinesPage() {
  const router = useRouter()
  const [expandedCategory, setExpandedCategory] = useState<string | null>("family")

  const lifelineCategories = [
    {
      id: "family",
      name: "Family & Relationships",
      tagline: "The struggles of connection, conflict, and the breakdown of the home",
      icon: "family_restroom",
      color: "rose",
      lifelines: [
        { name: "Struggling with Family", icon: "home", desc: "General tension or estrangement" },
        { name: "Impact of Divorce", icon: "link_off", desc: "Parental, personal, or late-stage/gray divorce" },
        { name: "Relationship Conflicts", icon: "sync_problem", desc: "Friendship drama, dating, or marriage rifts" },
        { name: "Wayward Loved Ones", icon: "directions_walk", desc: "The 'Prodigal' child, sibling, or spouse" },
        { name: "Forgiving Someone", icon: "handshake", desc: "The internal battle of letting go" },
        { name: "Difficulty Trusting Others", icon: "shield", desc: "Guardedness after betrayal" },
      ]
    },
    {
      id: "health",
      name: "Health & Loss",
      tagline: "The physical toll of life and the grief of what's been taken away",
      icon: "healing",
      color: "emerald",
      lifelines: [
        { name: "Physical Health Battles", icon: "local_hospital", desc: "New diagnosis or acute illness" },
        { name: "Chronic Pain / Disability", icon: "accessible", desc: "Long-term physical limitations" },
        { name: "Grieving a Loss", icon: "sentiment_sad", desc: "Death of a friend, spouse, or mentor" },
        { name: "Infertility & Pregnancy Loss", icon: "child_friendly", desc: "Parental loss, teen pregnancy, or biological struggle" },
        { name: "Special Needs & Autism", icon: "neurology", desc: "The unique weight of neurodiversity for the self or caregiver" },
        { name: "Caring for Aging Parents", icon: "elderly", desc: "The 'Sandwich Generation' crisis" },
      ]
    },
    {
      id: "mental",
      name: "Mental & Emotional",
      tagline: "The internal climate of the mind and soul",
      icon: "psychology",
      color: "blue",
      lifelines: [
        { name: "Feeling Stressed", icon: "speed", desc: "The daily weight of 'too much'" },
        { name: "Anxiety & Worry", icon: "sentiment_stressed", desc: "Fear of what is coming" },
        { name: "Depression & Low Mood", icon: "cloud", desc: "The heaviness of 'not enough'" },
        { name: "Burnout & Exhaustion", icon: "battery_0_bar", desc: "Running on empty" },
        { name: "Anger & Frustration", icon: "mood_bad", desc: "Simmering resentment or outbursts" },
        { name: "Feeling Invisible", icon: "visibility_off", desc: "A lack of recognition or value" },
      ]
    },
    {
      id: "work",
      name: "Work & Finances",
      tagline: "The pressure of provision, productivity, and future security",
      icon: "work",
      color: "amber",
      lifelines: [
        { name: "Financial Issues", icon: "money_off", desc: "Debt, fixed income, or scarcity" },
        { name: "Workplace or School Tension", icon: "business", desc: "Conflict with bosses, teachers, or peers" },
        { name: "Career or Academic Uncertainty", icon: "explore", desc: "Not knowing the next move" },
        { name: "Making a Hard Decision", icon: "call_split", desc: "Ethics, crossroads, and big pivots" },
      ]
    },
    {
      id: "faith",
      name: "Faith & Purpose",
      tagline: "The vertical relationship with God and the search for 'Why?'",
      icon: "church",
      color: "purple",
      lifelines: [
        { name: "Continuing My Faith Journey", icon: "route", desc: "Seeking growth and next steps" },
        { name: "Questioning My Beliefs", icon: "help", desc: "Doubt and deconstruction" },
        { name: "Finding My Purpose", icon: "lightbulb", desc: "The 'What am I here for?' cry" },
        { name: "Feeling Far from God", icon: "cloud_off", desc: "Spiritual dryness and silence" },
        { name: "Unanswered Prayer", icon: "hourglass_empty", desc: "Wrestling with God's 'No' or 'Not yet'" },
      ]
    },
    {
      id: "identity",
      name: "Self & Identity",
      tagline: "The battle for how one sees themselves",
      icon: "person",
      color: "cyan",
      lifelines: [
        { name: "Doubting My Value", icon: "self_improvement", desc: "Low self-worth and identity crisis" },
        { name: "Body Image Struggles", icon: "body_system", desc: "Comparing the physical self to others" },
        { name: "Comparison & Envy", icon: "compare", desc: "The 'thief of joy' in a social media world" },
        { name: "Dealing with Guilt & Shame", icon: "weight", desc: "The weight of past or present mistakes" },
      ]
    },
    {
      id: "trials",
      name: "Trials & Temptation",
      tagline: "The active fight against destructive patterns",
      icon: "gpp_maybe",
      color: "orange",
      lifelines: [
        { name: "Addiction Issues", icon: "psychology_alt", desc: "Substances, digital loops, or secret habits" },
        { name: "Battling Temptation", icon: "shield", desc: "The moment-by-moment choice for integrity" },
        { name: "Fear of the Future", icon: "schedule", desc: "Paralysis regarding the 'unknown'" },
      ]
    },
  ]

  const colorClasses: Record<string, { bg: string; border: string; text: string; icon: string; gradient: string }> = {
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-300", icon: "text-rose-400", gradient: "from-rose-500/20" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", icon: "text-emerald-400", gradient: "from-emerald-500/20" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300", icon: "text-blue-400", gradient: "from-blue-500/20" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300", icon: "text-amber-400", gradient: "from-amber-500/20" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300", icon: "text-purple-400", gradient: "from-purple-500/20" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-300", icon: "text-cyan-400", gradient: "from-cyan-500/20" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-300", icon: "text-orange-400", gradient: "from-orange-500/20" },
  }

  const totalLifelines = lifelineCategories.reduce((sum, cat) => sum + cat.lifelines.length, 0)

  return (
    <div className="min-h-screen bg-[#0c1929]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-purple-900/10 to-blue-900/20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-400/30">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Book%20of%20Life%20-%20Christian%20-%20Video-uZ0vBJPjlZIbPlSRaiqQ0zfvwyuxsh.mp4" type="video/mp4" />
                </video>
              </div>
              <span className="text-white font-bold">Life Stages</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-400/20 border border-rose-400/30 mb-6">
              <span className="material-symbols-outlined text-rose-400">favorite</span>
              <span className="text-sm font-bold text-rose-300 uppercase tracking-wider">{totalLifelines} Lifelines</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Scripture for Your <span className="text-rose-400">Moment of Need</span>
            </h1>
            
            <p className="text-lg text-blue-200/70 mb-8">
              At 3am when you can't sleep. In the hospital waiting room. Before the hard conversation. 
              Lifelines meet you exactly where you are with Scripture that speaks to <em>your</em> situation.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <span className="material-symbols-outlined text-cyan-400 text-lg">chat</span>
                <span className="text-cyan-300 text-sm">Text Chat</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <span className="material-symbols-outlined text-green-400 text-lg">call</span>
                <span className="text-green-300 text-sm">Voice Call</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <span className="material-symbols-outlined text-amber-400 text-lg">highlight</span>
                <span className="text-amber-300 text-sm">Verse Highlight</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Lifelines */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-4">
            {lifelineCategories.map((category) => {
              const colors = colorClasses[category.color]
              const isExpanded = expandedCategory === category.id

              return (
                <div key={category.id} className={`rounded-2xl border ${colors.border} overflow-hidden`}>
                  {/* Category Header */}
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className={`w-full flex items-center justify-between p-5 bg-gradient-to-r ${colors.gradient} to-transparent hover:bg-white/5 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${colors.icon}`}>{category.icon}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-bold">{category.name}</h3>
                        <p className="text-sm text-blue-200/50">{category.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-blue-200/40">{category.lifelines.length} topics</span>
                      <span className={`material-symbols-outlined ${colors.icon} transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </div>
                  </button>

                  {/* Lifelines Grid */}
                  {isExpanded && (
                    <div className="p-5 bg-white/[0.02] grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.lifelines.map((lifeline) => (
                        <div 
                          key={lifeline.name}
                          className={`rounded-xl p-4 ${colors.bg} border ${colors.border} hover:bg-white/10 transition-all cursor-pointer group`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`material-symbols-outlined ${colors.icon} group-hover:scale-110 transition-transform`}>
                              {lifeline.icon}
                            </span>
                            <div>
                              <h4 className="text-white font-semibold text-sm mb-1">{lifeline.name}</h4>
                              <p className="text-xs text-blue-200/60 leading-relaxed">{lifeline.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* For Churches CTA */}
      <section className="py-16 bg-gradient-to-b from-transparent to-indigo-950/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 border border-amber-400/30 mb-6">
            <span className="material-symbols-outlined text-amber-400">church</span>
            <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">For Churches</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Voice. Your Theology. 24/7.
          </h2>
          
          <p className="text-blue-200/70 mb-8">
            When you partner with Life Stages, every Lifeline speaks with your pastoral voice. 
            Your congregation gets Scripture-based support that sounds like <em>you</em> — 
            available whenever they need it, even at 3am.
          </p>

          <button
            onClick={() => router.push("/church")}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-amber-500/25 transition-all hover:scale-105"
          >
            Partner With Life Stages
          </button>
        </div>
      </section>

      {/* Crisis Support Notice */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-blue-900/40 rounded-2xl p-6 border border-blue-400/30">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-blue-400/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-400 text-2xl">support</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-3">Important Notice</h3>
                <p className="text-blue-200/80 leading-relaxed mb-4">
                  Life Stages provides Scripture-based encouragement and spiritual support. 
                  It is <strong className="text-white">not a substitute for professional mental health care, 
                  medical treatment, or crisis intervention</strong>.
                </p>
                <p className="text-blue-200/80 leading-relaxed mb-5">
                  If you or someone you know is experiencing a mental health crisis or thoughts of 
                  self-harm, please reach out immediately:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <a 
                    href="tel:988" 
                    className="flex items-center gap-3 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-green-400 text-2xl">call</span>
                    <div>
                      <p className="text-white font-bold">Call or Text 988</p>
                      <p className="text-sm text-blue-200/60">Suicide & Crisis Lifeline</p>
                    </div>
                  </a>
                  <a 
                    href="https://988lifeline.org/chat/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-cyan-400 text-2xl">chat</span>
                    <div>
                      <p className="text-white font-bold">Chat Online</p>
                      <p className="text-sm text-blue-200/60">988lifeline.org/chat</p>
                    </div>
                  </a>
                </div>
                <p className="text-blue-200/50 text-sm">
                  You can also contact your pastor, a licensed counselor, or call 911 in an emergency. 
                  You are not alone, and help is available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-200/40 text-sm">
              © 2026 Life Stages AI · A WinTech Partners Venture
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push("/church")}
                className="text-amber-400/70 hover:text-amber-400 transition-colors text-sm"
              >
                For Churches
              </button>
              <button
                onClick={() => router.push("/")}
                className="text-blue-400/70 hover:text-blue-400 transition-colors text-sm"
              >
                Try Life Stages
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
