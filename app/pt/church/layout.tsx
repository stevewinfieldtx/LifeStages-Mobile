import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI para Igrejas - Plataforma de App Bíblica de Marca Branca",
  description: "Plataforma devocional bíblica de marca branca para igrejas. Substitua o YouVersion pelo seu próprio aplicativo personalizado com inteligência pastoral, integração de sermões e personalização com IA.",
  openGraph: {
    title: "Life Stages AI para Igrejas",
    description: "Do Púlpito à Personalização. Sua marca, sua voz, seu DNA teológico.",
    type: "website",
    locale: "pt_BR",
  },
}

export default function PortugueseChurchLayout({ children }: { children: React.ReactNode }) {
  return children
}
