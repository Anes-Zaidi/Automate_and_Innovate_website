'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const links = [
  { href: '/#home', label: 'Home', id: 'home' },
  { href: '/#about', label: 'About', id: 'about' },
  { href: '/#sponsors', label: 'Sponsors', id: 'sponsors' },
  { href: '/#schedule', label: 'Schedule', id: 'schedule' },
  { href: '/#tracks', label: 'Tracks', id: 'tracks' },
  { href: '/#speakers', label: 'Speakers', id: 'speakers' },
  { href: '/#visitors', label: 'Visitors', id: 'visitors' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    links.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0,
        }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(10,10,10,0.95)' : '#0A0A0A',
        borderBottom: '1px solid rgba(249,98,29,0.15)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.svg"
              alt="SOAI"
              width={36}
              height={36}
              loading="eager"
              className="w-auto h-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, id }) => {
              const isActive = active === id
              return (
                <a
                  key={href}
                  href={href}
                  className="relative text-sm px-3 py-1.5 rounded-md transition-all duration-150"
                  style={{
                    color: isActive ? '#fff' : '#9ca3af',
                    backgroundColor: isActive ? 'rgba(249,98,29,0.12)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#9ca3af'
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: '#F9621D' }}
                    />
                  )}
                  <span className={isActive ? 'ml-2.5' : ''}>{label}</span>
                </a>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <a
              href="/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F9621D', color: '#0A0A0A' }}
            >
              Register
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav
            className="md:hidden pb-4 pt-2 space-y-1 border-t"
            style={{ borderColor: 'rgba(249,98,29,0.15)' }}
          >
            {links.map(({ href, label, id }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
                style={{
                  color: active === id ? '#fff' : '#9ca3af',
                  backgroundColor: active === id ? 'rgba(249,98,29,0.1)' : 'transparent',
                }}
              >
                {active === id && (
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#F9621D' }} />
                )}
                {label}
              </a>
            ))}
            <div className="pt-2 px-3">
              <a
                href="/register"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg"
                style={{ backgroundColor: '#F9621D', color: '#0A0A0A' }}
              >
                Register
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}