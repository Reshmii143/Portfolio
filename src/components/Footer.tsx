'use client'

import { useState } from 'react'
import { site } from '../data/site'
import { Eyes } from './Eyes'

const YEAR = new Date().getFullYear()

export function Footer() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <footer className="footer" id="contact">
      <div className="footer__cap" aria-hidden="true" />
      <div className="footer__inner">
        <div className="footer__eyes">
          <Eyes className="eyes--footer" />
        </div>
        <div className="footer__row">
          <p className="footer__connect">
            Let’s connect.
            <br />
            I’m always down for a chat.
          </p>
          <div className="footer__actions">
            {/* Opens the visitor's email app with a new message to Reshmi. */}
            <a className="footer__btn" href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} title={site.email}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>
            <a className="footer__btn" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
              </svg>
            </a>
            <a className="footer__btn" href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
              </svg>
            </a>
          </div>
        </div>
        <button type="button" className="footer__name" onClick={copyEmail} aria-label={`Copy ${site.email}`}>
          {site.fullName}
        </button>
        <div className="footer__meta">
          <p suppressHydrationWarning>© {YEAR} {site.fullName}</p>
          <p>Built with love</p>
        </div>
      </div>
      <div className={`toast${copied ? ' is-visible' : ''}`} role="status">
        {copied ? `Copied ${site.email}` : ''}
      </div>
    </footer>
  )
}
