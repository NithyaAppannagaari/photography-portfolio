import { useCallback, useEffect, useState, type DragEvent, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import {
  ShareError,
  createAlbum,
  getAlbum,
  listAlbums,
  login,
  logout,
  removeAlbum,
  removePhoto,
  shareMessage,
  updateAlbum,
  uploadPhoto,
  getToken,
  type Album,
  type AlbumSummary,
} from './share/api'
import { preparePhoto } from './share/optimize'
import { isSlug, suggestSlug } from './share/slug'
import { useNoIndex } from './share/useNoIndex'
import './ShareAdminPage.css'

function locked(error: unknown): boolean {
  return error instanceof ShareError && (error.status === 401 || error.status === 503)
}

export default function ShareAdminPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const [unlocked, setUnlocked] = useState(() => Boolean(getToken()))
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useNoIndex('Albums · Nithya Appannagaari Photography')

  function fail(err: unknown) {
    if (locked(err)) setUnlocked(false)
    setError(shareMessage(err))
  }

  async function onUnlock(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(password)
      setPassword('')
      setUnlocked(true)
    } catch (err: unknown) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  const lockDesk = () => {
    logout()
    setUnlocked(false)
    setError('')
  }

  const onAuth = useCallback(() => setUnlocked(false), [])

  return (
    <div className="desk-page">
      <SiteNav trailing={unlocked ? (
        <button type="button" className="text-btn" onClick={lockDesk}>Lock</button>
      ) : slug ? (
        <Link to="/share/admin" className="text-btn">Albums</Link>
      ) : null} />

      {!unlocked ? (
        <form className="desk-unlock" onSubmit={(event) => { void onUnlock(event) }}>
          <p className="kicker">Private</p>
          <h1>Client albums</h1>
          <p>Share a gallery with a link on your own site. The link stays until you delete the album.</p>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="desk__error" role="alert">{error}</p> : null}
          <button type="submit" className="btn btn-solid" disabled={busy}>
            {busy ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      ) : slug ? (
        <AlbumEditor slug={slug} onAuth={onAuth} />
      ) : (
        <AlbumList
          onCreated={(next) => navigate(`/share/admin/${next}`)}
          onAuth={onAuth}
        />
      )}
      <SiteFooter />
    </div>
  )
}

function AlbumList({
  onCreated,
  onAuth,
}: {
  onCreated: (slug: string) => void
  onAuth: () => void
}) {
  const [albums, setAlbums] = useState<AlbumSummary[] | null>(null)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    listAlbums()
      .then((result) => { if (active) setAlbums(result.albums) })
      .catch((err: unknown) => {
        if (!active) return
        if (locked(err)) onAuth()
        setError(shareMessage(err))
        setAlbums([])
      })
    return () => { active = false }
  }, [onAuth])

  async function onCreate(event: FormEvent) {
    event.preventDefault()
    const nextSlug = (slug || suggestSlug(title)).trim()
    if (!isSlug(nextSlug)) {
      setError('Use a link name of letters, numbers, and hyphens.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const result = await createAlbum({ slug: nextSlug, title: title.trim(), note: note.trim() })
      onCreated(result.album.slug)
    } catch (err: unknown) {
      if (locked(err)) onAuth()
      setError(shareMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="desk">
      <div className="desk__intro">
        <p className="kicker">Albums</p>
        <h1>Client albums</h1>
        <p>Each album has its own link. Nothing here is listed on the public site.</p>
      </div>

      <form className="desk-card" onSubmit={(event) => { void onCreate(event) }}>
        <h2>New album</h2>
        <label className="desk__field">
          <span>Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => { if (!slugTouched && !slug.trim()) setSlug(suggestSlug(title)) }}
            maxLength={120}
            required
          />
        </label>
        <label className="desk__field">
          <span>A note for your client</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} />
        </label>
        <label className="desk__field">
          <span>Link name</span>
          <input
            value={slug}
            onChange={(event) => {
              setSlugTouched(true)
              setSlug(event.target.value.toLowerCase())
            }}
            spellCheck={false}
            autoCapitalize="off"
            placeholder="filled in from the title"
          />
        </label>
        <p className="desk__hint">Letters, numbers, and hyphens. A short private ending keeps the link hard to guess.</p>
        {error ? <p className="desk__error" role="alert">{error}</p> : null}
        <button type="submit" className="btn btn-solid" disabled={busy}>
          {busy ? 'Creating…' : 'Create album'}
        </button>
      </form>

      <section className="desk-list" aria-label="Albums">
        {albums === null ? <p className="desk__hint">Opening your albums…</p> : null}
        {albums?.length === 0 ? <p className="desk__hint">No albums yet.</p> : null}
        {albums?.map((album) => (
          <Link key={album.slug} to={`/share/admin/${album.slug}`} className="desk-row">
            <span>
              <strong>{album.title}</strong>
              <em>/share/{album.slug}</em>
            </span>
            <span>{album.photoCount} photo{album.photoCount === 1 ? '' : 's'}</span>
          </Link>
        ))}
      </section>
    </main>
  )
}

function AlbumEditor({ slug, onAuth }: { slug: string; onAuth: () => void }) {
  const navigate = useNavigate()
  const [album, setAlbum] = useState<Album | null>(null)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [status, setStatus] = useState('')
  const [over, setOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let active = true
    setAlbum(null)
    setMissing(false)
    getAlbum(slug)
      .then((result) => {
        if (!active) return
        setAlbum(result.album)
        setTitle(result.album.title)
        setNote(result.album.note)
      })
      .catch((err: unknown) => {
        if (!active) return
        if (locked(err)) onAuth()
        const message = shareMessage(err)
        if (message === 'This link does not match an album.' || message === 'Not found.') setMissing(true)
        else setError(message)
      })
    return () => { active = false }
  }, [slug, onAuth])

  async function saveDetails(event: FormEvent) {
    event.preventDefault()
    setError('')
    setToast('')
    try {
      const result = await updateAlbum(slug, { title: title.trim(), note: note.trim() })
      setAlbum(result.album)
      setToast('Details saved')
    } catch (err: unknown) {
      if (locked(err)) onAuth()
      setError(shareMessage(err))
    }
  }

  async function copyLink() {
    const url = `${window.location.origin}/share/${slug}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const area = document.createElement('textarea')
      area.value = url
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      const copied = document.execCommand('copy')
      area.remove()
      if (!copied) {
        setToast('')
        setError('Select the link above and copy it.')
        return
      }
    }
    setToast('Link copied')
    setError('')
  }

  async function onFiles(list: FileList | File[]) {
    if (!album || uploading) return
    const files = Array.from(list)
    if (files.length === 0) return
    setUploading(true)
    setError('')
    setToast('')
    const problems: string[] = []
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index]
      setStatus(`Preparing ${index + 1} of ${files.length}, ${file.name}`)
      try {
        const prepared = await preparePhoto(file)
        setStatus(`Uploading ${index + 1} of ${files.length}, ${file.name}`)
        const result = await uploadPhoto(slug, prepared)
        setAlbum((current) => current ? { ...current, photos: [...current.photos, result.photo] } : current)
      } catch (err: unknown) {
        if (locked(err)) {
          onAuth()
          setUploading(false)
          setStatus('')
          setError(shareMessage(err))
          return
        }
        problems.push(`${file.name}: ${shareMessage(err)}`)
      }
    }
    setStatus('')
    setUploading(false)
    if (problems.length > 0) setError(problems.join(' '))
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setOver(false)
    void onFiles(event.dataTransfer.files)
  }

  async function onRemovePhoto(id: string) {
    setError('')
    try {
      await removePhoto(slug, id)
      setAlbum((current) => current ? { ...current, photos: current.photos.filter((photo) => photo.id !== id) } : current)
    } catch (err: unknown) {
      if (locked(err)) onAuth()
      setError(shareMessage(err))
    }
  }

  async function onDeleteAlbum() {
    try {
      await removeAlbum(slug)
      navigate('/share/admin')
    } catch (err: unknown) {
      if (locked(err)) onAuth()
      setError(shareMessage(err))
    }
  }

  if (missing) {
    return (
      <main className="desk">
        <h1>This link does not match an album.</h1>
        <Link to="/share/admin" className="text-link">Back to albums</Link>
      </main>
    )
  }

  if (!album) {
    return <main className="desk"><p className="desk__hint">{error || 'Opening the album…'}</p></main>
  }

  const publicUrl = `${window.location.origin}/share/${album.slug}`

  return (
    <main className="desk">
      <div className="desk__intro">
        <p className="kicker">Client albums</p>
        <h1>{album.title}</h1>
        <p className="desk__url">{publicUrl}</p>
        <div className="desk__actions">
          <button type="button" className="btn btn-solid" onClick={() => { void copyLink() }}>Copy link</button>
          <Link to={`/share/${album.slug}`} className="btn btn-line-ink">View album</Link>
        </div>
        {toast ? <p className="desk__toast" role="status">{toast}</p> : null}
      </div>

      <form className="desk-card" onSubmit={(event) => { void saveDetails(event) }}>
        <h2>Details</h2>
        <label className="desk__field">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />
        </label>
        <label className="desk__field">
          <span>A note for your client</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} />
        </label>
        <button type="submit" className="btn btn-line-ink">Save details</button>
      </form>

      <label
        className={`desk-drop ${over ? 'is-over' : ''}`}
        onDragOver={(event) => { event.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple
          disabled={uploading}
          onChange={(event) => {
            if (event.target.files) void onFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <span>Drop photographs here, or choose files.</span>
        <em>JPEG, PNG, or WebP. Up to 30 MB each.</em>
      </label>
      {status ? <p className="desk__hint">{status}</p> : null}
      {error ? <p className="desk__error" role="alert">{error}</p> : null}

      {album.photos.length === 0 ? (
        <p className="desk__hint">No photographs in this album yet.</p>
      ) : (
        <ul className="desk-photos">
          {album.photos.map((photo) => (
            <li key={photo.id}>
              <img
                src={`/api/share/albums/${album.slug}/photos/${photo.id}?size=thumb`}
                alt=""
                width={photo.width}
                height={photo.height}
              />
              <div>
                <p>{photo.name}</p>
                <button type="button" onClick={() => { void onRemovePhoto(photo.id) }} disabled={uploading}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="desk-danger">
        {confirmDelete ? (
          <button type="button" className="btn btn-solid" onClick={() => { void onDeleteAlbum() }}>
            Yes, delete this album
          </button>
        ) : (
          <button type="button" className="btn btn-line-ink" onClick={() => setConfirmDelete(true)}>
            Delete album
          </button>
        )}
      </div>
    </main>
  )
}
