import Link from 'next/link'
import { about, site } from '../data/site'
import { CursorArrow } from './CursorArrow'

export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <div className="about__paper" aria-hidden="true" />
      <div className="about__inner">
        <div className="about__bio reveal">
          <p className="about__tag">Bio</p>
          <div className="about__figma">
            <div className="about__figma-corners" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <h2 className="about__title" id="about-heading">
              I’m {site.firstName}{' '}
              <span className="about__inline-icon about__inline-icon--round" aria-hidden="true">
                <img src={site.portrait} alt="" />
              </span>{' '}
              a fresher {site.role.toLowerCase()} in {site.city} who gets excited{' '}
              <span className="about__inline-icon" aria-hidden="true">
                <img src="/assets/img/bulb.svg" alt="" />
              </span>{' '}
              about turning designs into fast, friendly interfaces{' '}
              <span className="about__inline-icon" aria-hidden="true">
                <img src="/assets/img/flower.svg" alt="" />
              </span>
              .
            </h2>
            <div className="about__copy">
              {about.copy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="about__note about__note--current">
              <p>{about.current}</p>
            </div>
            <div className="about__note about__note--coffee">
              <p>{about.coffee}</p>
            </div>
            <div className="about__cursor-tag" aria-hidden="true">
              <CursorArrow fill="#36c5f0" />
              <span>{site.firstName}</span>
            </div>
          </div>
        </div>

        <div className="about__story reveal">
          <p className="about__tag about__tag--dark">My story</p>
          <h3 className="about__story-title">How I like to work</h3>
          <ul className="about__principles">
            {about.principles.map((p) => (
              <li key={p.title} className={`about__principle about__principle--${p.tone}`}>
                <div className="about__principle-card">
                  <h4>{p.title}</h4>
                  <p>{p.body}</p>
                </div>
                <aside className="about__sticky" aria-hidden="true">
                  {p.sticky}
                </aside>
              </li>
            ))}
          </ul>
          <p className="about__more">
            <Link href="/skills">See my skills &amp; certifications →</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
