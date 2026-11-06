import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { FlightProvider } from './components/Flight'
import HomePage from './HomePage'
import GalleryPage from './GalleryPage'
import PricingPage from './PricingPage'

const ShareAlbumPage = lazy(() => import('./ShareAlbumPage'))
const ShareAdminPage = lazy(() => import('./ShareAdminPage'))

function HashScroll() {
  const { hash, pathname, search } = useLocation()
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (hash) {
      const node = document.getElementById(hash.slice(1))
      if (node) node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      return
    }
    window.scrollTo(0, 0)
  }, [hash, pathname, search])
  return null
}

export default function App() {
  return (
    <FlightProvider>
      <Suspense fallback={<div className="route-fallback" />}>
        <HashScroll />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery/:category" element={<GalleryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/share/admin" element={<ShareAdminPage />} />
          <Route path="/share/admin/:slug" element={<ShareAdminPage />} />
          <Route path="/share/:slug" element={<ShareAlbumPage />} />
        </Routes>
      </Suspense>
    </FlightProvider>
  )
}
