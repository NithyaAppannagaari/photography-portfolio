import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        el.classList.add('is-in')
        observer.disconnect()
      },
      { threshold: 0, rootMargin: '0px 0px 15% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined

  return (
    <div ref={ref} className={`reveal${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </div>
  )
}
