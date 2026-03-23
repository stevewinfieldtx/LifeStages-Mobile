import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI para Influencers - Plataforma de App Bíblica de Marca Blanca",
  description: "Plataforma devocional bíblica de marca blanca para influencers de fe. Tu propia aplicación personalizada con 50% de ingresos por suscripción.",
  openGraph: {
    title: "Life Stages AI para Influencers",
    description: "Convierte tu influencia en impacto del Reino. Tu marca, tu voz, 50% de los ingresos.",
    type: "website",
    locale: "es_ES",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
