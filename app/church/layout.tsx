import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI for Churches | White-Label Bible App Platform | Replace YouVersion",
  description: "White-label Bible devotional platform for churches. Personalized Scripture by age, gender, and life stage. Your branding, your theological voice, your pastoral intelligence dashboard. Free to start.",
  keywords: [
    "church Bible app",
    "white-label Bible app",
    "YouVersion alternative",
    "church devotional platform",
    "personalized Scripture",
    "pastoral intelligence",
    "church analytics",
    "congregation engagement",
    "digital discipleship",
    "church technology",
    "Bible app for churches",
    "sermon integration",
    "church voice AI",
    "Life Stages AI",
    "church member engagement",
    "Scripture personalization",
    "church branding",
    "devotional app",
    "crisis support Lifelines",
    "church dashboard"
  ],
  authors: [{ name: "Life Stages AI", url: "https://bibleforlifestages.com" }],
  creator: "Life Stages AI - A WinTech Partners Venture",
  publisher: "Life Stages AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bibleforlifestages.com/church",
    siteName: "Life Stages AI",
    title: "Life Stages AI for Churches | White-Label Bible App Platform",
    description: "Stop sending your congregation to YouVersion. White-label the Life Stages platform with YOUR brand, YOUR voice, YOUR theological DNA. Pastoral intelligence dashboard shows what your congregation is going through before they tell you.",
    images: [
      {
        url: "/og-church.png",
        width: 1200,
        height: 630,
        alt: "Life Stages AI - White-Label Bible App for Churches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Stages AI for Churches | White-Label Bible App Platform",
    description: "Your brand. Your voice. Your theological DNA. White-label Bible devotional platform with pastoral intelligence dashboard.",
    images: ["/og-church.png"],
    creator: "@lifestagesai",
  },
  alternates: {
    canonical: "https://bibleforlifestages.com/church",
  },
  category: "Church Technology",
  classification: "Church Software, Bible App, Devotional Platform",
}

export default function ChurchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
