"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { LanguageDropdown } from "@/components/language-dropdown"
import { ElevenLabsWidget } from "@/components/elevenlabs-widget"
import { ChurchTranslations } from "@/lib/church-translations"

interface ChurchLandingPageProps {
  t: ChurchTranslations
  lang: string
  emailSuffix?: string
}

export function ChurchLandingPageContent({ t, lang, emailSuffix = "" }: ChurchLandingPageProps) {
  const router = useRouter()
  const [showWhyFortyOne, setShowWhyFortyOne] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    churchName: "",
    contactName: "",
    email: "",
    phone: "",
    role: "",
    congregation: "",
    message: "",
    selectedTier: "",
    language: lang,
  })

  const personalizationFactors = [
    { label: t.ageRange, count: "4", icon: "cake", desc: t.ageRangeDesc },
    { label: t.gender, count: "2", icon: "wc", desc: t.genderDesc },
    { label: t.lifeStage, count: "4", icon: "diversity_3", desc: t.lifeStageDesc },
    { label: t.language, count: "50+", icon: "translate", desc: t.languageDesc },
    { label: t.country, count: "195", icon: "public", desc: t.countryDesc },
    { label: t.denomination, count: "✓", icon: "church", desc: t.denominationDesc },
    { label: t.churchVoice, count: "✓", icon: "record_voice_over", desc: t.churchVoiceDesc },
  ]

  const lifelines = [
    t.anxietyWorry, t.griefLoss, t.marriageStruggles, t.parentingChallenges,
    t.financialStress, t.healthCrisis, t.addictionRecovery, t.depression,
    t.loneliness, t.careerConfusion, t.faithDoubts, t.forgiveness,
    t.angerManagement, t.fear, t.identityCrisis, t.relationshipConflict,
    t.spiritualDryness, t.temptation, t.lifeTransitions, t.findingPurpose,
    t.burnout, t.rejection, t.selfWorth, t.guiltShame,
    t.patience, t.trustIssues, t.hope, t.peace
  ]

  const pricingTiers = [
    {
      id: "free",
      name: t.starterName,
      tagline: t.starterTagline,
      setup: t.free,
      monthly: t.free,
      highlight: false,
      features: [
        t.starterFeature1, t.starterFeature2, t.starterFeature3, t.starterFeature4,
        t.starterFeature5, t.starterFeature6, t.starterFeature7,
      ],
      cta: t.starterCta,
    },
    {
      id: "weekly",
      name: t.weeklyName,
      tagline: t.weeklyTagline,
      setup: "$141",
      monthly: "$41",
      highlight: true,
      features: [
        t.weeklyFeature1, t.weeklyFeature2, t.weeklyFeature3, t.weeklyFeature4,
        t.weeklyFeature5, t.weeklyFeature6, t.weeklyFeature7,
      ],
      cta: t.weeklyCta,
    },
    {
      id: "voice",
      name: t.voiceName,
      tagline: t.voiceTagline,
      setup: "$241",
      monthly: "$141",
      highlight: false,
      features: [
        t.voiceFeature1, t.voiceFeature2, t.voiceFeature3, t.voiceFeature4,
        t.voiceFeature5, t.voiceFeature6, t.voiceFeature7, t.voiceFeature8,
      ],
      cta: t.voiceCta,
    },
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Thank you! We'll be in touch within 24 hours.")
    setShowContactForm(false)
  }

  return (
    <div className="min-h-screen bg-[#0c1929]">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-amber-900/20"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-400/10 rounded-full blur-3xl"></div>
          
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
                <LanguageDropdown variant="dark" />
                <button
                  onClick={() => setShowWhyFortyOne(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-colors group"
                >
                  <span className="size-5 rounded-full bg-amber-400/30 flex items-center justify-center text-xs font-bold text-amber-300">41</span>
                  <span className="text-xs text-amber-300/80 group-hover:text-amber-300">{t.ourStory}</span>
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
            </div>

            {/* Hero Content */}
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 border border-amber-400/30 mb-6">
                <span className="material-symbols-outlined text-amber-400">church</span>
                <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">{t.forChurches}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {t.heroTitle} <span className="text-amber-400">{t.heroTitleHighlight}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-200/80 mb-6">
                {t.heroSubtitle}
              </p>
              
              <p className="text-lg text-blue-200/60 max-w-2xl mx-auto mb-8">
                {t.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-amber-500/25 transition-all"
                >
                  {t.seePricingPlans}
                </button>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  {t.scheduleDemo}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-indigo-950/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">{t.sundayToSundayGap}</h2>
                <div className="space-y-4 text-blue-200/80">
                  <p>{t.problemP1}</p>
                  <p><strong className="text-amber-400">{t.problemHighlight}</strong></p>
                  <p>{t.problemP2}</p>
                  <p className="text-white font-semibold">{t.problemP3}</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">lightbulb</span>
                  {t.prismTitle}
                </h3>
                <p className="text-blue-200/70 mb-4">{t.prismDesc}</p>
                <div className="grid grid-cols-2 gap-3">
                  {personalizationFactors.map((factor) => (
                    <div key={factor.label} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-amber-400 text-lg">{factor.icon}</span>
                        <span className="text-white font-semibold text-sm">{factor.label}</span>
                      </div>
                      <p className="text-xs text-blue-200/50">{factor.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">{t.howItWorks}</h2>
              <p className="text-blue-200/70">{t.howItWorksDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: t.step1Title, desc: t.step1Desc, icon: "palette" },
                { step: "2", title: t.step2Title, desc: t.step2Desc, icon: "model_training" },
                { step: "3", title: t.step3Title, desc: t.step3Desc, icon: "group_add" },
                { step: "4", title: t.step4Title, desc: t.step4Desc, icon: "auto_awesome" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl">{item.icon}</span>
                  </div>
                  <div className="size-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto -mt-10 mb-4 text-amber-400 font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-blue-200/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lifelines Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-purple-950/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-400/20 border border-rose-400/30 mb-4">
                <span className="material-symbols-outlined text-rose-400 text-sm">favorite</span>
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">{t.lifelinesTag}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">{t.lifelinesTitle}</h2>
              <p className="text-blue-200/70 max-w-2xl mx-auto">{t.lifelinesDesc}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {lifelines.map((lifeline) => (
                <span 
                  key={lifeline}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-blue-200/70 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                >
                  {lifeline}
                </span>
              ))}
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <span className="material-symbols-outlined text-cyan-400 text-3xl mb-3">chat</span>
                <h3 className="text-white font-bold mb-2">{t.textConversations}</h3>
                <p className="text-sm text-blue-200/60">{t.textConversationsDesc}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <span className="material-symbols-outlined text-green-400 text-3xl mb-3">call</span>
                <h3 className="text-white font-bold mb-2">{t.voiceConversations}</h3>
                <p className="text-sm text-blue-200/60">{t.voiceConversationsDesc}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <span className="material-symbols-outlined text-amber-400 text-3xl mb-3">highlight</span>
                <h3 className="text-white font-bold mb-2">{t.instantExplanation}</h3>
                <p className="text-sm text-blue-200/60">{t.instantExplanationDesc}</p>
              </div>
            </div>

            {/* Crisis Notice */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-400/20">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-xl mt-0.5">info</span>
                  <div>
                    <p className="text-blue-200/80 text-sm leading-relaxed">{t.crisisNotice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">{t.pricingTitle}</h2>
              <p className="text-blue-200/70 mb-4">{t.pricingSubtitle}</p>
              <button
                onClick={() => setShowWhyFortyOne(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 transition-colors text-sm"
              >
                <span className="material-symbols-outlined text-base">help</span>
                <span>{t.whyPricesEnd41}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {pricingTiers.map((tier) => (
                <div 
                  key={tier.id}
                  className={`rounded-2xl p-6 ${
                    tier.highlight 
                      ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-2 border-amber-400/50' 
                      : 'bg-white/5 border border-white/10'
                  } relative`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 rounded-full text-xs font-bold text-white">
                      {t.mostPopular}
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className={`text-xl font-bold ${tier.highlight ? 'text-amber-400' : 'text-white'}`}>
                      {tier.name}
                    </h3>
                    <p className="text-sm text-blue-200/60 mt-1">{tier.tagline}</p>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-blue-200/50">{t.setup}</span>
                        <span className={`text-lg font-bold ${tier.setup === t.free ? 'text-green-400' : 'text-white'}`}>
                          {tier.setup}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-center gap-1 mt-1">
                        <span className={`text-3xl font-bold ${tier.monthly === t.free ? 'text-green-400' : 'text-white'}`}>
                          {tier.monthly}
                        </span>
                        {tier.monthly !== t.free && (
                          <span className="text-blue-200/50 text-sm">{t.month}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className={`material-symbols-outlined text-base mt-0.5 ${tier.highlight ? 'text-amber-400' : 'text-green-400'}`}>
                          check_circle
                        </span>
                        <span className="text-blue-200/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setFormData({ ...formData, selectedTier: tier.name })
                      setShowContactForm(true)
                    }}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 hover:shadow-lg hover:shadow-amber-500/25'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Member Pricing */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-white/10 max-w-3xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{t.memberPricingTitle}</h3>
                <p className="text-blue-200/70 text-sm">{t.memberPricingSubtitle}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-blue-400 text-2xl mb-2">person</span>
                  <p className="text-2xl font-bold text-white">$5<span className="text-sm text-blue-200/50">{t.month}</span></p>
                  <p className="text-sm text-blue-200/60">{t.individual}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-green-400 text-2xl mb-2">family_restroom</span>
                  <p className="text-2xl font-bold text-white">$10<span className="text-sm text-blue-200/50">{t.month}</span></p>
                  <p className="text-sm text-blue-200/60">{t.familyPlan}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Giving Back */}
        <section className="py-16 bg-gradient-to-b from-transparent to-green-950/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/20 border border-green-400/30 mb-6">
              <span className="material-symbols-outlined text-green-400">volunteer_activism</span>
              <span className="text-sm font-bold text-green-300 uppercase tracking-wider">{t.givingBackTag}</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-6">{t.givingBackTitle}</h2>
            <p className="text-lg text-blue-200/70 mb-8 max-w-2xl mx-auto">{t.givingBackDesc}</p>
            
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="material-symbols-outlined text-amber-400 text-2xl mb-2">public</span>
                <p className="text-white font-semibold">{t.missions}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="material-symbols-outlined text-blue-400 text-2xl mb-2">location_city</span>
                <p className="text-white font-semibold">{t.localOutreach}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="material-symbols-outlined text-rose-400 text-2xl mb-2">healing</span>
                <p className="text-white font-semibold">{t.cancerSupport}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pastoral Intelligence */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 mb-4">
                <span className="material-symbols-outlined text-cyan-400 text-sm">insights</span>
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">{t.pastoralTag}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{t.pastoralTitle} <span className="text-cyan-400">{t.pastoralTitleHighlight}</span></h2>
              <p className="text-blue-200/70 max-w-2xl mx-auto">{t.pastoralDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-bold mb-4">{t.beforeLifeStages}</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-blue-200/60"><span className="material-symbols-outlined text-red-400">close</span>{t.beforeItem1}</li>
                  <li className="flex items-center gap-3 text-blue-200/60"><span className="material-symbols-outlined text-red-400">close</span>{t.beforeItem2}</li>
                  <li className="flex items-center gap-3 text-blue-200/60"><span className="material-symbols-outlined text-red-400">close</span>{t.beforeItem3}</li>
                  <li className="flex items-center gap-3 text-blue-200/60"><span className="material-symbols-outlined text-red-400">close</span>{t.beforeItem4}</li>
                  <li className="flex items-center gap-3 text-blue-200/60"><span className="material-symbols-outlined text-red-400">close</span>{t.beforeItem5}</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/30">
                <h3 className="text-cyan-400 font-bold mb-4">{t.withLifeStages}</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white"><span className="material-symbols-outlined text-green-400">check</span>{t.afterItem1}</li>
                  <li className="flex items-center gap-3 text-white"><span className="material-symbols-outlined text-green-400">check</span>{t.afterItem2}</li>
                  <li className="flex items-center gap-3 text-white"><span className="material-symbols-outlined text-green-400">check</span>{t.afterItem3}</li>
                  <li className="flex items-center gap-3 text-white"><span className="material-symbols-outlined text-green-400">check</span>{t.afterItem4}</li>
                  <li className="flex items-center gap-3 text-white"><span className="material-symbols-outlined text-green-400">check</span>{t.afterItem5}</li>
                </ul>
              </div>
            </div>
            <p className="text-center mt-8 text-blue-200/60">{t.notSurveillance} <span className="text-cyan-400 font-semibold">{t.shepherding}</span>. {t.aggregatedAnonymous}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gradient-to-b from-transparent to-indigo-950/30">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-400/30 mb-4">
                <span className="material-symbols-outlined text-purple-400 text-sm">help</span>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">{t.faqTag}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{t.faqTitle}</h2>
              <p className="text-blue-200/70">{t.faqSubtitle}</p>
            </div>
            
            <div className="space-y-4">
              {[
                { q: t.faq1Q, a: t.faq1A },
                { q: t.faq2Q, a: t.faq2A },
                { q: t.faq3Q, a: t.faq3A },
                { q: t.faq4Q, a: t.faq4A },
                { q: t.faq5Q, a: t.faq5A },
                { q: t.faq6Q, a: t.faq6A },
              ].map((faq, idx) => (
                <details key={idx} className="group bg-white/5 rounded-xl border border-white/10">
                  <summary className="flex items-center justify-between p-4 cursor-pointer text-white font-semibold">
                    {faq.q}
                    <span className="material-symbols-outlined text-blue-200/50 group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-4 pb-4 text-blue-200/70 text-sm">{faq.a}</div>
                </details>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-blue-200/60 mb-4">{t.stillHaveQuestions}</p>
              <button
                onClick={() => setShowContactForm(true)}
                className="px-6 py-3 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-xl font-semibold hover:bg-purple-500/30 transition-colors"
              >
                {t.letsTalk}
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-t from-amber-900/20 to-transparent">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.finalCtaTitle}</h2>
            <p className="text-lg text-blue-200/70 mb-8 max-w-2xl mx-auto">{t.finalCtaDesc}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowContactForm(true)}
                className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-amber-500/25 transition-all"
              >
                {t.scheduleYourDemo}
              </button>
              <a 
                href={`mailto:churches${emailSuffix}@bibleforlifestages.com`}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">mail</span>
                churches{emailSuffix}@bibleforlifestages.com
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-200/40 text-sm">{t.footerCopyright}</p>
            <button
              onClick={() => setShowWhyFortyOne(true)}
              className="flex items-center gap-2 text-amber-400/70 hover:text-amber-400 transition-colors text-sm group"
            >
              <span className="size-6 rounded-full bg-amber-400/20 flex items-center justify-center text-xs font-bold group-hover:bg-amber-400/30 transition-colors">41</span>
              <span>{t.ourStory}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Why 41 Modal */}
      {showWhyFortyOne && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f2137] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-400/30">
            <div className="sticky top-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 p-6 border-b border-amber-400/20 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-400">41</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t.why41Title}</h3>
                    <p className="text-xs text-amber-300/70">{t.why41Subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowWhyFortyOne(false)}
                  className="size-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-rose-400 font-semibold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">emergency</span>
                  {t.why41Origin}
                </h4>
                <p className="text-blue-200/80 text-sm leading-relaxed">{t.why41OriginP1}</p>
                <p className="text-blue-200/80 text-sm leading-relaxed mt-3">{t.why41OriginP2}</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-blue-400">dark_mode</span>
                  <span className="text-white font-semibold">{t.why41MomentTime}</span>
                </div>
                <p className="text-blue-200/80 text-sm leading-relaxed">{t.why41MomentP1}</p>
                <p className="text-blue-200/80 text-sm leading-relaxed mt-3">{t.why41MomentP2}</p>
                <p className="text-rose-300/90 text-sm leading-relaxed mt-3 font-medium italic">{t.why41MomentQuote}</p>
              </div>

              <div>
                <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">lightbulb</span>
                  {t.why41Revelation}
                </h4>
                <p className="text-blue-200/80 text-sm leading-relaxed">{t.why41RevelationP1}</p>
                <blockquote className="my-4 pl-4 border-l-2 border-amber-400/50">
                  <p className="text-white text-sm italic leading-relaxed">{t.why41RevelationQuote}</p>
                </blockquote>
                <p className="text-blue-200/80 text-sm leading-relaxed">{t.why41RevelationP2}</p>
                <p className="text-white text-sm leading-relaxed mt-3 font-semibold">{t.why41RevelationP3}</p>
              </div>

              <div className="bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-xl p-5 border border-amber-400/20">
                <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">menu_book</span>
                  {t.why41Connection}
                </h4>
                <p className="text-blue-200/80 text-sm leading-relaxed">{t.why41ConnectionP1}</p>
                <p className="text-blue-200/80 text-sm leading-relaxed mt-2">{t.why41ConnectionP2}</p>
                <p className="text-amber-300 text-sm leading-relaxed mt-3 font-semibold">{t.why41ConnectionP3}</p>
                <p className="text-white text-sm leading-relaxed mt-3 italic">{t.why41ConnectionP4}</p>
              </div>

              <div>
                <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">church</span>
                  {t.why41ChurchTitle}
                </h4>
                <p className="text-blue-200/80 text-sm leading-relaxed">{t.why41ChurchP1}</p>
                <p className="text-blue-200/80 text-sm leading-relaxed mt-3">{t.why41ChurchP2}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#0f2137] px-6 py-4 border-t border-white/10">
              <button
                onClick={() => setShowWhyFortyOne(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {t.continueToPricing}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f2137] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-[#0f2137] p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{t.contactTitle}</h3>
              <button 
                onClick={() => setShowContactForm(false)}
                className="size-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.churchName} *</label>
                <input
                  type="text"
                  required
                  value={formData.churchName}
                  onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  placeholder={t.placeholderChurchName}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.yourName} *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder={t.placeholderName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.role}</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder={t.placeholderRole}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.email} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder={t.placeholderEmail}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.phone}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    placeholder={t.placeholderPhone}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.congregationSize}</label>
                <select
                  value={formData.congregation}
                  onChange={(e) => setFormData({ ...formData, congregation: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">{t.selectSize}</option>
                  <option value="under-100">{t.under100}</option>
                  <option value="100-500">{t.size100_500}</option>
                  <option value="500-1000">{t.size500_1000}</option>
                  <option value="1000-5000">{t.size1000_5000}</option>
                  <option value="5000+">{t.size5000plus}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.interestedPlan}</label>
                <select
                  value={formData.selectedTier}
                  onChange={(e) => setFormData({ ...formData, selectedTier: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">{t.selectPlan}</option>
                  <option value="Starter">{t.starterName} ({t.free})</option>
                  <option value="Weekly Sermon">{t.weeklyName} ($41{t.month})</option>
                  <option value="Church Voice">{t.voiceName} ($141{t.month})</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200/70 mb-1">{t.anythingElse}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 resize-none"
                  placeholder={t.placeholderMessage}
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {t.sendMessage}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* ElevenLabs Voice Agent Widget */}
      <ElevenLabsWidget />
    </div>
  )
}
