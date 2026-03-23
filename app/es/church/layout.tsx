import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI para Iglesias - Plataforma de App Bíblica de Marca Blanca",
  description: "Plataforma devocional bíblica de marca blanca para iglesias. Reemplace YouVersion con su propia aplicación personalizada con inteligencia pastoral, integración de sermones y personalización con IA.",
  keywords: [
    "aplicación bíblica para iglesias",
    "alternativa a YouVersion",
    "plataforma devocional de iglesia",
    "aplicación bíblica de marca blanca",
    "inteligencia pastoral",
    "integración de sermones",
    "devocionales personalizados",
    "aplicación bíblica en español"
  ],
  openGraph: {
    title: "Life Stages AI para Iglesias",
    description: "Del Púlpito a la Personalización. Su marca, su voz, su ADN teológico.",
    type: "website",
    locale: "es_ES",
  },
}

export default function SpanishChurchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
