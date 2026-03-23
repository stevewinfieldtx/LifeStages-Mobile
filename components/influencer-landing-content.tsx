"use client"

import { useRouter } from "next/navigation"
import { ElevenLabsWidget } from "@/components/elevenlabs-widget"

// Simplified influencer landing for localized versions
// Uses same structure as church page but with influencer-specific copy

interface InfluencerTranslations {
  backToApp: string
  ourStory: string
  forInfluencers: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  seePricingPlans: string
  scheduleDemo: string
  starterName: string
  weeklyName: string
  voiceName: string
  free: string
  month: string
  footerCopyright: string
}

const translations: Record<string, InfluencerTranslations> = {
  es: {
    backToApp: "Volver a la App",
    ourStory: "Nuestra Historia",
    forInfluencers: "Para Influencers",
    heroTitle: "Convierte Tu Influencia en",
    heroSubtitle: "Impacto del Reino",
    heroDescription: "Tu propia aplicación bíblica de marca blanca con tu voz, tu marca, tu misión — y el 50% de los ingresos por suscripción.",
    seePricingPlans: "Ver Planes de Precios",
    scheduleDemo: "Programar una Demo",
    starterName: "Inicial",
    weeklyName: "Contenido Semanal",
    voiceName: "Voz del Creador",
    free: "GRATIS",
    month: "/mes",
    footerCopyright: "© 2026 Life Stages AI · Una Empresa de WinTech Partners",
  },
  pt: {
    backToApp: "Voltar ao App",
    ourStory: "Nossa História",
    forInfluencers: "Para Influenciadores",
    heroTitle: "Transforme Sua Influência em",
    heroSubtitle: "Impacto do Reino",
    heroDescription: "Seu próprio aplicativo bíblico de marca branca com sua voz, sua marca, sua missão — e 50% da receita de assinaturas.",
    seePricingPlans: "Ver Planos de Preços",
    scheduleDemo: "Agendar uma Demo",
    starterName: "Inicial",
    weeklyName: "Conteúdo Semanal",
    voiceName: "Voz do Criador",
    free: "GRÁTIS",
    month: "/mês",
    footerCopyright: "© 2026 Life Stages AI · Uma Empresa WinTech Partners",
  },
  vi: {
    backToApp: "Quay lại Ứng dụng",
    ourStory: "Câu Chuyện Của Chúng Tôi",
    forInfluencers: "Dành Cho Influencer",
    heroTitle: "Biến Tầm Ảnh Hưởng Của Bạn Thành",
    heroSubtitle: "Tác Động Vương Quốc",
    heroDescription: "Ứng dụng Kinh Thánh thương hiệu riêng của bạn với giọng nói của bạn, thương hiệu của bạn, sứ mệnh của bạn — và 50% doanh thu đăng ký.",
    seePricingPlans: "Xem Bảng Giá",
    scheduleDemo: "Đặt Lịch Demo",
    starterName: "Khởi Đầu",
    weeklyName: "Nội Dung Hàng Tuần",
    voiceName: "Giọng Nói Người Sáng Tạo",
    free: "MIỄN PHÍ",
    month: "/tháng",
    footerCopyright: "© 2026 Life Stages AI · Một Công Ty WinTech Partners",
  },
}

export function InfluencerLandingContent({ lang }: { lang: "es" | "pt" | "vi" }) {
  const router = useRouter()
  const t = translations[lang]
  
  return (
    <div className="min-h-screen bg-[#0c1929]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-amber-900/20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-pink-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm">{t.backToApp}</span>
            </button>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-400/10 border border-pink-400/30 hover:bg-pink-400/20 transition-colors group">
                <span className="size-5 rounded-full bg-pink-400/30 flex items-center justify-center text-xs font-bold text-pink-300">41</span>
                <span className="text-xs text-pink-300/80 group-hover:text-pink-300">{t.ourStory}</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-pink-400/30">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Book%20of%20Life%20-%20Christian%20-%20Video-uZ0vBJPjlZIbPlSRaiqQ0zfvwyuxsh.mp4" type="video/mp4" />
                  </video>
                </div>
                <span className="text-white font-bold">Life Stages</span>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-400/20 border border-pink-400/30 mb-6">
              <span className="material-symbols-outlined text-pink-400">star</span>
              <span className="text-sm font-bold text-pink-300 uppercase tracking-wider">{t.forInfluencers}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {t.heroTitle} <span className="text-pink-400">{t.heroSubtitle}</span>
            </h1>
            
            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto mb-8">
              {t.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-pink-500/25 transition-all"
              >
                {t.seePricingPlans}
              </button>
              <button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                {t.scheduleDemo}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">{t.starterName}</h3>
              <p className="text-3xl font-bold text-green-400 mb-4">{t.free}</p>
              <ul className="space-y-2 text-blue-200/70 text-sm">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-base">check</span>
                  White-label branding
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-base">check</span>
                  28+ Lifelines
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-base">check</span>
                  50% revenue share
                </li>
              </ul>
            </div>
            
            {/* Weekly */}
            <div className="bg-gradient-to-br from-pink-400/20 to-purple-500/20 border-2 border-pink-400/50 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-pink-500 rounded-full text-xs font-bold text-white">
                POPULAR
              </div>
              <h3 className="text-xl font-bold text-pink-400 mb-2">{t.weeklyName}</h3>
              <p className="text-3xl font-bold text-white mb-4">$41<span className="text-sm text-blue-200/50">{t.month}</span></p>
              <ul className="space-y-2 text-blue-200/70 text-sm">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-pink-400 text-base">check</span>
                  Weekly content integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-pink-400 text-base">check</span>
                  YouTube transcript processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-pink-400 text-base">check</span>
                  Follower insights dashboard
                </li>
              </ul>
            </div>
            
            {/* Voice */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">{t.voiceName}</h3>
              <p className="text-3xl font-bold text-white mb-4">$141<span className="text-sm text-blue-200/50">{t.month}</span></p>
              <ul className="space-y-2 text-blue-200/70 text-sm">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-base">check</span>
                  1,000+ videos ingested
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-base">check</span>
                  Full Creator Voice AI
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-base">check</span>
                  Complete voice integration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-blue-200/40 text-sm">{t.footerCopyright}</p>
        </div>
      </footer>
      
      {/* ElevenLabs Voice Agent Widget */}
      <ElevenLabsWidget />
    </div>
  )
}
