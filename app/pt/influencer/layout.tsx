import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI para Influenciadores - Plataforma de App Bíblica de Marca Branca",
  description: "Plataforma devocional bíblica de marca branca para influenciadores de fé. Seu próprio aplicativo personalizado com 50% de receita de assinaturas.",
  openGraph: {
    title: "Life Stages AI para Influenciadores",
    description: "Transforme sua influência em impacto do Reino. Sua marca, sua voz, 50% da receita.",
    type: "website",
    locale: "pt_BR",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
