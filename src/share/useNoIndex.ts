import { useEffect } from 'react'

export function useNoIndex(title: string): void {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    let meta = document.querySelector('meta[name="robots"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    const previous = meta.getAttribute('content')
    meta.setAttribute('content', 'noindex')
    return () => {
      document.title = previousTitle
      if (created || previous === 'noindex') meta?.remove()
      else if (previous) meta?.setAttribute('content', previous)
    }
  }, [title])
}
