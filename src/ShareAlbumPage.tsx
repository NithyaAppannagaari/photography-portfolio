import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteFooter from './components/SiteFooter'
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

  useNoIndex(album ? `${album.title} · Nithya Appannagaari` : 'Gallery · Nithya Appannagaari')

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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
      if (!album) return
      if (event.key === 'ArrowRight') setOpen((index) => (index === null ? index : (index + 1) % album.photos.length))
      if (event.key === 'ArrowLeft') {
        setOpen((index) => (index === null ? index : (index - 1 + album.photos.length) % album.photos.length))
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
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
    <div className="share-page linen">
      <header className="page-header">
        <div className="page-header__bar">
          <Link to="/" className="page-header__back">Home</Link>
          <Link to="/" className="page-header__mark">Nithya</Link>
          {album ? (
            <button
              type="button"
              className="btn btn-solid page-header__action"
              onClick={() => { void downloadAll() }}
              disabled={count === 0 || zipping}
            >
              {zipping ? 'Preparing…' : 'Download all'}
            </button>
          ) : <span />}
        </div>
        {album ? (
          <div className="page-header__intro">
            <p className="eyebrow eyebrow--ink">A gallery for you</p>
            <h1>{album.title}</h1>
            <p className="page-header__lede">{album.note || 'Photographs by Nithya Appannagaari.'}</p>
          </div>
        ) : null}
      </header>

      {album ? (
        <>
          <p className="share-count">
            {count === 0 ? 'No photographs yet' : `${count} photograph${count === 1 ? '' : 's'}`}
          </p>
          {error ? <p className="share-note" role="alert">{error}</p> : null}
          {count === 0 ? (
            <p className="share-empty">No photographs in this album yet.</p>
          ) : (
            <div className="share-grid">
              {album.photos.map((photo, index) => (
                <figure key={photo.id} className="share-card" style={{ '--delay': `${Math.min(index * 0.035, 0.45)}s` } as React.CSSProperties}>
                  <button type="button" className="share-card__hit" onClick={() => setOpen(index)}>
                    <span className="share-card__frame">
                      <img
                        src={photoUrl(album.slug, photo.id, 'thumb')}
                        alt={photo.name}
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                      />
                      <span className="share-card__idx">{String(index + 1).padStart(2, '0')}</span>
                    </span>
                  </button>
                </figure>
              ))}
            </div>
          )}
        </>
      ) : missing ? (
        <div className="share-missing">
          <p className="eyebrow eyebrow--ink">Album</p>
          <h1>This link does not match an album.</h1>
          <Link to="/" className="text-link">Back home</Link>
        </div>
      ) : (
        <p className="share-empty">{error || 'Opening the album…'}</p>
      )}

      {album && active && open !== null ? (
        <div className="share-light" role="dialog" aria-modal="true" aria-label={active.name}>
          <div className="share-light__bar">
            <button type="button" className="share-light__text" onClick={() => setOpen(null)}>Close</button>
            <p>{String(open + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
            <a className="share-light__text" href={photoUrl(album.slug, active.id, 'original', true)}>Download</a>
          </div>
          <button
            type="button"
            className="share-light__stage"
            onClick={() => setOpen(null)}
            aria-label="Close photograph"
          >
            <img
              src={photoUrl(album.slug, active.id, 'display')}
              alt={active.name}
              onClick={(event) => event.stopPropagation()}
            />
          </button>
          {count > 1 ? (
            <div className="share-light__nav">
              <button type="button" onClick={() => setOpen((open - 1 + count) % count)}>Previous</button>
              <button type="button" onClick={() => setOpen((open + 1) % count)}>Next</button>
            </div>
          ) : null}
        </div>
      ) : null}

      <SiteFooter />
    </div>
  )
}
