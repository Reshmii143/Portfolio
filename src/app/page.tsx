import { About } from '@/components/About'
import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { CertificationsSection, Marquee, SkillsSection } from '@/components/SkillsSections'

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <About />
      <Marquee />
      <SkillsSection id="skills" />
      <CertificationsSection id="certifications" />
    </main>
  )
}
