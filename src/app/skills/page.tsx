import type { Metadata } from 'next'
import { SkillsPage } from '@/components/SkillsPage'

export const metadata: Metadata = {
  title: 'Skills & Certifications',
  description: 'The languages, frameworks and tools Reshmi works with, and the certifications she has earned.',
}

export default function Skills() {
  return <SkillsPage />
}
