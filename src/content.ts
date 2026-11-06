import clubCover from './assets/club_photoshoots/DSC08853 (1).jpg'
import clubSize from './assets/club_photoshoots/DSC08853 (1).jpg?intrinsic'
import eventCover from './assets/event_photography/wide6 (1).jpeg'
import eventSize from './assets/event_photography/wide6 (1).jpeg?intrinsic'
import dayCover from './assets/sunny/golden-trio.webp'
import daySize from './assets/sunny/golden-trio.webp?intrinsic'

export type Shot = { src: string; width: number; height: number; alt: string }

export type Work = {
  slug: string
  title: string
  slogan: [string, string, string]
  desc: string
  color: string
  tags: string[]
  photos: number
  cover: Shot | null
  prefer: string
  soon?: boolean
}

const shot = (src: string, size: { width: number; height: number }, alt: string): Shot => ({
  src,
  width: size.width,
  height: size.height,
  alt,
})

export const PURPLE = '#6e1848'
export const BROWN = '#441c1e'
export const CREAM = '#F3E9D8'

function photoCount(files: Record<string, unknown>): number {
  return Object.keys(files).length
}

const CLUB_PHOTOS = photoCount(import.meta.glob('./assets/club_photoshoots/*', { eager: true, query: '?intrinsic', import: 'default' }))
const EVENT_PHOTOS = photoCount(import.meta.glob('./assets/event_photography/*', { eager: true, query: '?intrinsic', import: 'default' }))
const DAY_PHOTOS = photoCount(import.meta.glob('./assets/sunny/*.webp', { eager: true, query: '?intrinsic', import: 'default' }))

export const WORKS: Work[] = [
  {
    slug: 'club-photoshoots',
    title: 'Clubs',
    slogan: ['the', 'team', 'shot'],
    desc: 'Headshots and team photos for clubs.',
    color: PURPLE,
    tags: ['Clubs', 'Headshots', 'Groups'],
    photos: CLUB_PHOTOS,
    cover: shot(clubCover, clubSize, 'Club photograph'),
    prefer: 'DSC08853',
  },
  {
    slug: 'event-photography',
    title: 'Events',
    slogan: ['on', 'the', 'night'],
    desc: 'Photos from campus events.',
    color: PURPLE,
    tags: ['Events', 'Campus', 'Groups'],
    photos: EVENT_PHOTOS,
    cover: shot(eventCover, eventSize, 'Event photograph'),
    prefer: 'wide6',
  },
  {
    slug: 'daylight',
    title: 'Daylight',
    slogan: ['out', 'in', 'the sun'],
    desc: 'Sun, lawns, and the golden hour around campus.',
    color: PURPLE,
    tags: ['Daylight', 'Campus', 'Headshots'],
    photos: DAY_PHOTOS,
    cover: shot(dayCover, daySize, 'Three women in warm golden-hour light.'),
    prefer: 'golden-trio',
  },
  {
    slug: 'graduation-photoshoots',
    title: 'Grads',
    slogan: ['the', 'last', 'walk'],
    desc: 'Grad photos around campus.',
    color: PURPLE,
    tags: ['Grads', 'Headshots', 'Campus'],
    photos: 0,
    cover: null,
    prefer: '',
    soon: true,
  },
]

export const RATES = [
  {
    id: 'graduation',
    title: 'Graduation photoshoots',
    price: '$70',
    unit: 'per hour',
    badge: 'Grads',
    features: ['Up to 4 locations', 'Editing included', 'A digital gallery', 'Print-ready files'],
    note: 'We can sort hours and timing when you write.',
  },
  {
    id: 'club-small',
    title: 'Club photoshoots',
    price: '$65',
    unit: 'per hour',
    badge: 'Under 25 people',
    features: ['Individual and group shots', 'Editing included', 'A digital gallery'],
    note: 'Headshots and team photos.',
  },
  {
    id: 'club-large',
    title: 'Club photoshoots',
    price: '$70–75',
    unit: 'per hour',
    badge: '25 or more people',
    features: ['Individual and group shots', 'Editing included', 'A digital gallery'],
    note: 'Headshots and team photos.',
  },
] as const

export const ABOUT = [
  'Editing and a digital gallery are included. For grads, that includes print-ready files.',
]

export const SERVICES = ['Clubs', 'Grads', 'Events', 'Headshots', 'Campus', 'Daylight', '& more']

export const SUNNY_ALT: Record<string, string> = {
  'golden-trio.webp': 'Three women in warm golden-hour light.',
  'blue-sky.webp': 'A portrait in direct sun, blue sky behind her.',
  'lift.webp': 'A dancer lifted outdoors in daylight, smiling.',
  'trees.webp': 'Three people smiling in bright light, green trees behind them.',
  'columns.webp': 'Four women in daylight in front of stone columns.',
  'daylight-pair.webp': 'Two women standing together in bright daylight.',
  'candid.webp': 'People talking outdoors, trees and daylight behind them.',
  'golden-green.webp': 'A group in golden light with green trees behind them.',
  'jump.webp': 'Two dancers jumping, blue sky behind them.',
  'circle.webp': 'A circle of dancers on a sunny lawn.',
  'lawn.webp': 'A group seated on the grass in the sun.',
  'golden-portrait.webp': 'A close portrait in warm golden light.',
  'laugh.webp': 'A woman laughing in bright outdoor light.',
  'sky-dancers.webp': 'Three dancers outdoors, sun and blue sky behind them.',
  'garba-sun.webp': 'Dancers outdoors in the sun.',
}

export const INSTAGRAM = 'https://www.instagram.com/flicsbynith'

export function workBySlug(slug: string | undefined): Work | undefined {
  return WORKS.find((work) => work.slug === slug)
}
