import { ChurchLandingPageContent } from "@/components/church-landing-content"
import { churchTranslations } from "@/lib/church-translations"

export default function VietnameseChurchPage() {
  return <ChurchLandingPageContent t={churchTranslations.vi} lang="vi" emailSuffix=".vn" />
}
