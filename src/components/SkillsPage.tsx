import { site } from '../data/site'
import { CursorArrow } from './CursorArrow'
import { DisplacementGrid } from './DisplacementGrid'
import { Eyes } from './Eyes'
import { InteractiveFrame } from './InteractiveFrame'
import { CertificationsSection, Marquee, SkillsSection } from './SkillsSections'

export function SkillsPage() {
  return (
    <main>
      <section className="skills-hero" id="skills" aria-labelledby="skills-heading">
        <DisplacementGrid />
        <div className="skills-hero__inner">
          <p className="skills-hero__eyebrow">what I work with</p>
          <div className="skills-hero__frame">
            <InteractiveFrame label="Skills title frame" surfaceClassName="skills-hero__box">
              <span className="hero__peek">
                <Eyes className="eyes--hero" />
              </span>
              <h1 className="skills-hero__title" id="skills-heading">
                Skills &amp; Certifications
              </h1>
            </InteractiveFrame>
            <span className="skills-hero__cursor" aria-hidden="true">
              <CursorArrow fill="#ecb22e" />
              <span>{site.firstName}</span>
            </span>
          </div>
          <p className="skills-hero__lede">
            The tools I reach for, the ones I’m learning next, and the courses that got me here. Drag the frame around — it’s a Figma habit.
          </p>
        </div>
      </section>

      <Marquee />

      <SkillsSection />
      <CertificationsSection cta />
    </main>
  )
}
