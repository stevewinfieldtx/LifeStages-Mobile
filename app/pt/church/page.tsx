import { ChurchLandingPageContent } from "@/components/church-landing-content"
import { churchTranslations } from "@/lib/church-translations"

export default function PortugueseChurchPage() {
  return <ChurchLandingPageContent t={churchTranslations.pt} lang="pt" emailSuffix=".pt" />
}
