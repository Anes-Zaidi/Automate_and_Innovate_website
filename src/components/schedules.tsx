'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Path builder ─────────────────────────────────────────────────────────────
//
// ONE unbroken d-string — no M jumps mid-path.
// The line travels:
//   tip (above circle 0)
//   → straight down through circle 0  (hidden behind the div)
//   → Bézier sweep to circle 1
//   → straight down through circle 1
//   → Bézier sweep to circle 2  …etc.
//
// Because it's a single sub-path, stroke-dashoffset draws it as one line.
//
// HOW TO TUNE cpRatio:
//   0.55 (default) – long vertical sections, tight mid-sweep
//   0.35            – shorter verticals, wider bow in the middle
//
function buildPath(
  circles: { cx: number; top: number; bottom: number }[],
  cpRatio = 0.55,
): string {
  if (circles.length < 1) return ''

  const first = circles[0]

  // Start at the tip dot, go straight down into and through the first circle
  let d = `M ${first.cx} ${first.top - 100} L ${first.cx} ${first.bottom}`

  for (let i = 0; i < circles.length - 1; i++) {
    const from = circles[i]
    const to   = circles[i + 1]

    const x0 = from.cx
    const y0 = from.bottom   // exit: bottom of current circle

    const x1 = to.cx
    const y1 = to.top        // entry: top of next circle

    const dy = y1 - y0

    // CP1: directly below exit → vertical departure
    const cp1x = x0
    const cp1y = y0 + dy * cpRatio

    // CP2: directly above entry → vertical arrival
    const cp2x = x1
    const cp2y = y1 - dy * cpRatio

    // Bézier to the top of next circle, then straight down through it
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`
    d += ` L ${x1} ${to.bottom}`
  }

  // Exit: straight tail below the last circle, same length as the entry antenna
  const last = circles[circles.length - 1]
  d += ` L ${last.cx} ${last.bottom + 100}`

  return d
}

// ─── Data ────────────────────────────────────────────────────────────────────

const EVENTS = [
  {
    day:   'Thursday',
    side:  'left' as const,
    title: 'Launch & Simultaneous Workshops',
    items: [
      { time: '14:00', desc: 'Reception & Check-in at the Registration Booth.' },
      { time: '15:00', desc: 'Opening Ceremony & Corporate Challenge Pitch.' },
      { time: '16:00', desc: 'Launch of Parallel Workshops. Teams move to their respective zones.' },
    ],
  },
  {
    day:   'Friday',
    side:  'right' as const,
    title: 'Continuous Sprint',
    items: [
      { time: null, desc: 'Final mini sprint pitch rehearsal sessions, followed by final demos and the awards ceremony at 18:00.' },
    ],
  },
  {
    day:   'Saturday',
    side:  'left' as const,
    title: 'Finalization & Pitch',
    items: [
      { time: null, desc: 'Final morning sprint, pitch rehearsal sessions, followed by final demos and the awards ceremony at 18:00.' },
    ],
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Schedules() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef      = useRef<SVGPathElement>(null)
  const circleRefs   = useRef<(HTMLDivElement | null)[]>([])

  const [pathD,      setPathD]      = useState('')
  const [svgW,       setSvgW]       = useState(0)
  const [svgH,       setSvgH]       = useState(0)
  const [totalLen,   setTotalLen]   = useState(0)
  const [drawn,      setDrawn]      = useState(0)   // how many px of the path are visible
  const [dotPos,     setDotPos]     = useState({ x: 0, y: 0 })
  const [tipX,       setTipX]       = useState(0)
  const [tipY,       setTipY]       = useState(0)
  const [tailX,      setTailX]      = useState(0)
  const [tailY,      setTailY]      = useState(0)

  // ── Rebuild path whenever layout changes ─────────────────────────────────
  const recalculate = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const { left: cl, top: ct, width, height } = container.getBoundingClientRect()
    const extraTop = 120

    setSvgW(width)
    setSvgH(height + extraTop)

    const circleData = circleRefs.current
      .filter(Boolean)
      .map((el) => {
        const r = el!.getBoundingClientRect()
        return {
          cx:     r.left - cl + r.width  / 2,
          top:    r.top  - ct + extraTop,
          bottom: r.top  - ct + r.height + extraTop,
        }
      })

    if (circleData.length < 1) return

    setTipX(circleData[0].cx)
    setTipY(circleData[0].top - 100)

    const last = circleData[circleData.length - 1]
    setTailX(last.cx)
    setTailY(last.bottom + 100)
    setPathD(buildPath(circleData))
    setDrawn(0)
  }, [])

  // ── Resolve total length after path renders ───────────────────────────────
  useEffect(() => {
    if (!pathD || !pathRef.current) return
    setTotalLen(pathRef.current.getTotalLength())
  }, [pathD])

  // ── Scroll → draw ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (totalLen === 0 || !pathRef.current) return

    const onScroll = () => {
      const container = containerRef.current
      if (!container || !pathRef.current) return

      const rect   = container.getBoundingClientRect()
      const vh     = window.innerHeight

      // progress: 0 when top of container is at 80% viewport height,
      //           1 when bottom of container has scrolled to 20% viewport height
      const start  = rect.top  - vh * 0.8
      const end    = rect.bottom - vh * 0.2
      const raw    = Math.min(Math.max(-start / (end - start), 0), 1)

      const newDrawn = raw * totalLen
      setDrawn(newDrawn)

      // Move the dot to the current tip of the drawn line
      if (newDrawn > 0) {
        const pt = pathRef.current.getPointAtLength(Math.min(newDrawn, totalLen - 0.1))
        setDotPos({ x: pt.x, y: pt.y })
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [totalLen])

  // ── ResizeObserver ────────────────────────────────────────────────────────
  useEffect(() => {
    recalculate()
    const ro = new ResizeObserver(recalculate)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [recalculate])

  // strokeDashoffset trick: array = totalLen, offset = totalLen - drawn
  const dashArray  = totalLen || 9999
  const dashOffset = Math.max(dashArray - drawn, 0)
  const showDot    = drawn > 1

  return (
    <div className="relative w-full py-24 px-4 sm:px-6 overflow-hidden">
      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.5); }
          65%  { transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .circle-node     { animation: popIn         0.6s cubic-bezier(.34,1.56,.64,1) both; }
        .text-from-left  { animation: fadeSlideLeft  0.5s ease-out both; }
        .text-from-right { animation: fadeSlideRight 0.5s ease-out both; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl font-bold text-center mb-20 tracking-tight"
          style={{ color: '#F4C430' }}
        >
          Schedules &amp; Training
        </h2>

        <div ref={containerRef} className="relative" style={{ paddingTop: '120px' }}>

          {/* ── SVG overlay ──────────────────────────────────────────────── */}
          {svgW > 0 && pathD && (
            <svg
              width={svgW}
              height={svgH}
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="absolute pointer-events-none"
              style={{ top: '-120px', left: 0, zIndex: 0, overflow: 'visible' }}
              aria-hidden="true"
            >
              <defs>
                <filter id="sglow" x="-60%" y="-20%" width="220%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint full-path ghost so user can see where the line will go */}
              <path
                d={pathD}
                fill="none"
                stroke="#FF6B35"
                strokeWidth={1.5}
                strokeOpacity={0.08}
                strokeLinecap="round"
              />

              {/* Glow layer — same single path, thicker + blurred */}
              <path
                d={pathD}
                fill="none"
                stroke="#FF6B35"
                strokeWidth={12}
                strokeOpacity={0.13}
                strokeLinecap="round"
                filter="url(#sglow)"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />

              {/* Main crisp line — the one whose length getTotalLength reads */}
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#FF6B35"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
              />

              {/* Tip dot — follows the drawing head */}
              {showDot && (
                <>
                  <circle cx={dotPos.x} cy={dotPos.y} r={6}  fill="#FF6B35" />
                  <circle cx={dotPos.x} cy={dotPos.y} r={11} fill="none"
                    stroke="#FF6B35" strokeWidth={1} strokeOpacity={0.3} />
                </>
              )}

              {/* Static tip dot at the very top (antenna cap) */}
              {totalLen > 0 && (
                <>
                  <circle cx={tipX} cy={tipY} r={5} fill="#FF6B35" opacity={0.9} />
                  <circle cx={tipX} cy={tipY} r={9} fill="none"
                    stroke="#FF6B35" strokeWidth={1} strokeOpacity={0.3} />
                </>
              )}

              {/* Static tail dot at the very bottom — appears when fully drawn */}
              {drawn >= totalLen * 0.97 && totalLen > 0 && (
                <>
                  <circle cx={tailX} cy={tailY} r={5} fill="#FF6B35"
                    style={{ opacity: 1, transition: 'opacity 0.4s ease' }} />
                  <circle cx={tailX} cy={tailY} r={9} fill="none"
                    stroke="#FF6B35" strokeWidth={1} strokeOpacity={0.3}
                    style={{ opacity: 1, transition: 'opacity 0.4s ease 0.15s' }} />
                </>
              )}
            </svg>
          )}

          {/* ── Event rows ─────────────────────────────────────────────────── */}
          <div className="relative flex flex-col gap-36" style={{ zIndex: 1 }}>
            {EVENTS.map((event, i) => {
              const isRight = event.side === 'right'
              return (
                <div
                  key={event.day}
                  className={`flex items-center gap-10 sm:gap-16 ${isRight ? 'flex-row-reverse' : ''}`}
                >
                  {/* Circle */}
                  <div
                    ref={(el) => { circleRefs.current[i] = el }}
                    className="circle-node flex-shrink-0
                               w-36 h-36 sm:w-44 sm:h-44
                               rounded-full border-2
                               flex items-center justify-center text-center
                               cursor-default select-none"
                    style={{
                      borderColor:     '#FF6B35',
                      backgroundColor: '#16191F',
                      animationDelay:  `${0.1 + i * 1.0}s`,
                      boxShadow:       '0 0 0 1px rgba(255,107,53,0.12), 0 0 40px rgba(255,107,53,0.10)',
                    }}
                  >
                    <span
                      className="text-xl sm:text-2xl font-bold leading-tight px-3"
                      style={{ color: '#FF6B35' }}
                    >
                      {event.day}
                    </span>
                  </div>

                  {/* Text */}
                  <div
                    className={`flex-1 ${isRight ? 'text-from-right text-right' : 'text-from-left'}`}
                    style={{ animationDelay: `${0.3 + i * 1.0}s` }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white tracking-tight">
                      {event.title}
                    </h3>
                    <ul className="space-y-2">
                      {event.items.map((item, j) => (
                        <li
                          key={j}
                          className={`text-sm text-gray-300 leading-relaxed flex gap-2 items-baseline
                                      ${isRight ? 'flex-row-reverse' : ''}`}
                        >
                          <span style={{ color: '#FF6B35', flexShrink: 0 }}>✦</span>
                          <span>
                            {item.time && (
                              <span className="font-semibold text-white">{item.time}:&nbsp;</span>
                            )}
                            {item.desc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}