import { ChurchLandingPageContent } from "@/components/church-landing-content"
import { churchTranslations } from "@/lib/church-translations"

export default function SpanishChurchPage() {
  return <ChurchLandingPageContent t={churchTranslations.es} lang="es" emailSuffix=".es" />
}
