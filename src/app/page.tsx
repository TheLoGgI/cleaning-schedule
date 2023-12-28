import FeatureSection from "./components/landing/FeatureSection"
import HeroSection from "./components/landing/HeroSection"
import PricingSection from "./components/landing/PricingSection"

export const dynamic = "force-dynamic"

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between lg:p-24">
      <HeroSection />
      <FeatureSection />
      <PricingSection />
    </main>
  )
}
