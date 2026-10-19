import Link from 'next/link'
import { certifications, skillGroups } from '../data/site'

const allSkills = skillGroups.flatMap((g) => g.skills)

/** An endlessly scrolling ribbon of every skill; the list is doubled so the loop is seamless. */
export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[...allSkills, ...allSkills].map((s, i) => (
          <span key={i} className="marquee__item">
            {s}
            <img src="/assets/img/flower.svg" alt="" width="22" height="22" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** Colour-coded skill cards, grouped by languages, frameworks, tools and what's being learned. */
export function SkillsSection({ id }: { id?: string }) {
  return (
    <section className="skills" id={id} aria-labelledby="skills-groups-heading">
      <div className="skills__paper" aria-hidden="true" />
      <div className="skills__inner">
        <p className="about__tag reveal">Toolbox</p>
        <h2 className="skills__heading reveal" id="skills-groups-heading">
          Skills
        </h2>
        <ul className="skills__grid">
          {skillGroups.map((g, i) => (
            <li key={g.title} className={`skill-card skill-card--${g.tone} reveal`} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="skill-card__head">
                <h3>{g.title}</h3>
                <span className="skill-card__note">{g.note}</span>
              </div>
              <ul className="skill-card__chips">
                {g.skills.map((s) => (
                  <li key={s} className="skill-chip">
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Certificate cards with a rosette, tilted like paper pinned to a board. */
export function CertificationsSection({ id, cta }: { id?: string; cta?: boolean }) {
  return (
    <section className="certs" id={id} aria-labelledby="certs-heading">
      <div className="certs__inner">
        <p className="about__tag about__tag--dark reveal">Proof of learning</p>
        <h2 className="skills__heading reveal" id="certs-heading">
          Certifications
        </h2>
        <ul className="certs__grid">
          {certifications.map((c, i) => (
            <li key={c.title} className={`cert cert--${c.tone} reveal`} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="cert__ribbon" aria-hidden="true">
                <svg viewBox="0 0 40 52">
                  <path d="M8 30 4 50l10-6 6 8 4-20M32 30l4 20-10-6-6 8-4-20" fill="#111212" />
                  <circle cx="20" cy="20" r="17" fill="currentColor" stroke="#111212" strokeWidth="2.5" />
                  <path d="m13 20 5 5 9-10" fill="none" stroke="#111212" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="cert__issuer">
                {c.issuer} · {c.year}
              </p>
              <h3 className="cert__title">{c.title}</h3>
              <a className="cert__link" href={c.url} target="_blank" rel="noopener noreferrer">
                View credential <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        {cta && (
          <div className="certs__cta reveal">
            <p>Want to see these skills in action?</p>
            <Link href="/#projects" className="stack__link">
              See my projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
