// Hero artwork URLs, per art set ('desktop' = 16:9 collage, 'mobile' = square collage).
const files = import.meta.glob('/assets/site/hero/*/*.avif', { eager: true, query: '?url', import: 'default' })

export const heroFile = (set, name) => files[`/assets/site/hero/${set}/${name}.avif`]

// Every image the hero needs for one art set: the final poster plus all intro layers.
export const heroUrls = (set) => [
  heroFile(set, 'poster'),
  heroFile(set, 'poster-logo'),
  ...Array.from({ length: 10 }, (_, i) => heroFile(set, `shard-${String(i + 1).padStart(2, '0')}`)),
  heroFile(set, 'logo-vi'),
  heroFile(set, 'logo-gta'),
]

const cache = new Map()
export function loadImage(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => img.decode().then(() => resolve(img), () => resolve(img))
        img.onerror = reject
        img.src = url
      }),
    )
  }
  return cache.get(url)
}

// Resolves when the fonts we use and the hero images are ready.
export async function preloadHero(set) {
  await Promise.all([
    document.fonts.load('500 1em Outfit'),
    document.fonts.load('700 1em Outfit'),
    document.fonts.load('900 1em "Barlow Condensed"'),
  ])
  await Promise.all([document.fonts.ready, ...heroUrls(set).map(loadImage)])
}

export const artSet = () => (window.matchMedia('(max-aspect-ratio: 1/1)').matches ? 'mobile' : 'desktop')
