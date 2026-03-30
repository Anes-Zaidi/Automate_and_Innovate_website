'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  className?: string
  threshold?: number
  rootMargin?: string
}

export default function FadeUp({
  children,
  delay = 0,
  className = '',
  threshold = 0.1,
  rootMargin = '0px',
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? `fadeUpAnim 0.8s ease-out ${delay}s forwards` : 'none',
      }}
    >
      {children}
    </div>
  )
}
