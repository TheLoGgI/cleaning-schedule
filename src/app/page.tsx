import FeatureSection from "./components/landing/FeatureSection"
import HeroSection from "./components/landing/HeroSection"
import { Metadata } from "next"
import PricingSection from "./components/landing/PricingSection"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Manage Your Cleaning Schedule with Ease",
  description: "Simplify Your Cleaning Routine, and Get More Done",
}

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between lg:p-24">
      <HeroSection />
      <FeatureSection />
      <PricingSection />
    </main>
  )
}
