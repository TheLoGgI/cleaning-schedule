import HeroSection from "./components/landing/HeroSection"

export const dynamic = "force-dynamic"

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between lg:p-24">
      <HeroSection />
    </main>
  )
}
