import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PhotoViewer from './components/PhotoViewer'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import { getAlbum, photoUrl, shareMessage, type Album } from './share/api'
import { extForType, fileName } from './share/slug'
import { useNoIndex } from './share/useNoIndex'
import { zipPhotos } from './share/zip'
import './ShareAlbumPage.css'

export default function ShareAlbumPage() {
  const { slug = '' } = useParams()
  const [album, setAlbum] = useState<Album | null>(null)
  const [missing, setMissing] = useState(false)
  const [error, setError] = useState('')
  const [zipping, setZipping] = useState(false)
  const [open, setOpen] = useState<number | null>(null)

  useNoIndex(album ? `${album.title} · Nithya Appannagaari Photography` : 'Nithya Appannagaari Photography')

  useEffect(() => {
    let active = true
    setAlbum(null)
    setMissing(false)
    setError('')
    setOpen(null)
    getAlbum(slug)
      .then((result) => {
        if (active) setAlbum(result.album)
      })
      .catch((err: unknown) => {
        if (!active) return
        const message = shareMessage(err)
        if (message === 'This link does not match an album.' || message === 'Not found.') setMissing(true)
        else setError(message)
      })
    return () => { active = false }
  }, [slug])

  useEffect(() => {
    if (open === null) return
    document.querySelector('.viewer')?.scrollIntoView({ block: 'start' })
  }, [open])

  useEffect(() => {
    if (open === null || !album) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') setOpen((index) => (index === null ? index : (index + 1) % album.photos.length))
      if (event.key === 'ArrowLeft') {
        setOpen((index) => (index === null ? index : (index - 1 + album.photos.length) % album.photos.length))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, album])

  async function downloadAll() {
    if (!album || album.photos.length === 0 || zipping) return
    setZipping(true)
    setError('')
    try {
      const files: { name: string; bytes: Uint8Array }[] = []
      for (const photo of album.photos) {
        const response = await fetch(photoUrl(album.slug, photo.id, 'original'))
        if (!response.ok) throw new Error('A photograph could not be downloaded. Try again in a moment.')
        files.push({
          name: fileName(photo.name, extForType(photo.originalType)),
          bytes: new Uint8Array(await response.arrayBuffer()),
        })
      }
      const blob = zipPhotos(files)
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = `${album.slug}.zip`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(href)
    } catch (err: unknown) {
      setError(shareMessage(err))
    } finally {
      setZipping(false)
    }
  }

  const count = album?.photos.length ?? 0
  const active = album && open !== null ? album.photos[open] : null

  return (
    <div className="share-page">
      <SiteNav trailing={album && count > 0 ? (
        <button type="button" className="text-btn" onClick={() => { void downloadAll() }} disabled={zipping}>
          {zipping ? 'Preparing…' : 'Download all'}
        </button>
      ) : null} />

      {album ? (
        <>
          <header className="intro">
            <p className="kicker">Gallery</p>
            <h1>{album.title}</h1>
            <p>{album.note || 'Photographs by Nithya Appannagaari.'}</p>
          </header>
          {error ? <p className="share-note" role="alert">{error}</p> : null}
          {count === 0 ? (
            <p className="share-empty">No photographs in this album yet.</p>
          ) : active && open !== null ? (
            <PhotoViewer
              src={photoUrl(album.slug, active.id, 'display')}
              alt={active.name}
              index={open}
              count={count}
              onPrev={() => setOpen((open - 1 + count) % count)}
              onNext={() => setOpen((open + 1) % count)}
              onClose={() => setOpen(null)}
              downloadHref={photoUrl(album.slug, active.id, 'original', true)}
            />
          ) : (
            <div className="frames share-frames">
              {album.photos.map((photo, index) => (
                <button key={photo.id} type="button" onClick={() => setOpen(index)}>
                  <img
                    src={photoUrl(album.slug, photo.id, 'thumb')}
                    alt={photo.name}
                    width={photo.width}
                    height={photo.height}
                  />
                </button>
              ))}
            </div>
          )}
        </>
      ) : missing ? (
        <div className="share-empty">
          <h1>This link does not match an album.</h1>
          <Link to="/" className="text-link">Back home</Link>
        </div>
      ) : (
        <p className="share-empty">{error || 'Opening the album…'}</p>
      )}
      <SiteFooter />
    </div>
  )
}
