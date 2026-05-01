import { HeroSection } from '@/components/homepage/HeroSection'
import { MarqueeBand } from '@/components/homepage/MarqueeBand'
import { PrestationsGrid } from '@/components/homepage/PrestationsGrid'
import { MiniGame } from '@/components/homepage/MiniGame'
import { GamesCatalog } from '@/components/homepage/GamesCatalog'
import { StatsBlock } from '@/components/homepage/StatsBlock'
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection'
import { FaqSection } from '@/components/homepage/FaqSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBand />
      <PrestationsGrid />
      <MiniGame />
      <GamesCatalog />
      <StatsBlock />
      <TestimonialsSection />
      <FaqSection />
    </>
  )
}
