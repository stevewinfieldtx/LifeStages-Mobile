import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Stages AI for Influencers | White-Label Bible App Platform | Monetize Your Ministry",
  description: "White-label Bible devotional platform for faith influencers. Personalized Scripture by age, gender, and life stage. Your branding, your voice, 50% revenue share. Know what your followers are going through.",
  keywords: [
    "faith influencer Bible app",
    "white-label Bible app",
    "Christian influencer platform",
    "faith creator monetization",
    "personalized Scripture",
    "follower insights",
    "influencer analytics",
    "follower engagement",
    "digital ministry",
    "faith creator technology",
    "Bible app for influencers",
    "content creator Bible app",
    "influencer voice AI",
    "Life Stages AI",
    "follower engagement",
    "Scripture personalization",
    "influencer branding",
    "devotional app",
    "crisis support Lifelines",
    "influencer dashboard"
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
    url: "https://bibleforlifestages.com/influencer",
    siteName: "Life Stages AI",
    title: "Life Stages AI for Influencers | White-Label Bible App Platform",
    description: "Turn your influence into impact. White-label the Life Stages platform with YOUR brand, YOUR voice, and earn 50% of subscription revenue. Know what your followers are going through.",
    images: [
      {
        url: "/og-influencer.png",
        width: 1200,
        height: 630,
        alt: "Life Stages AI - White-Label Bible App for Faith Influencers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Stages AI for Influencers | White-Label Bible App Platform",
    description: "Your brand. Your voice. 50% revenue share. White-label Bible devotional platform with follower insights dashboard.",
    images: ["/og-influencer.png"],
    creator: "@lifestagesai",
  },
  alternates: {
    canonical: "https://bibleforlifestages.com/influencer",
  },
  category: "Faith Creator Technology",
  classification: "Influencer Software, Bible App, Devotional Platform",
}

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
