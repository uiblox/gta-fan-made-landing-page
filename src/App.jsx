import { useCallback, useEffect, useState } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { artSet, preloadHero } from './lib/hero-assets'

// <html data-intro> is 'active' until the intro ends: it hides the poster and the UI, which the intro fades in.
const setIntroAttr = (v) => { document.documentElement.dataset.intro = v }
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [phase, setPhase] = useState('loading') // loading -> playing -> done
  const [loaderOut, setLoaderOut] = useState(false)
  const [assets, setAssets] = useState(false) // fonts and images loaded
  const [prepared, setPrepared] = useState(REDUCED) // intro layers pre-rendered and warmed up (nothing to prepare with reduced motion)

  useEffect(() => {
    let cancelled = false
    preloadHero(artSet())
      .catch(() => {}) // a missing file must never trap the visitor on the loader
      .then(() => !cancelled && setAssets(true))
    return () => { cancelled = true }
  }, [])

  // The loader stays until everything is ready, so the intro never stutters or shows a blank screen.
  /* eslint-disable react-hooks/set-state-in-effect -- sequencing the loader/intro hand-over, not derivable state */
  useEffect(() => {
    if (!assets || !prepared) return
    if (REDUCED) {
      setIntroAttr('done')
      setPhase('done')
      setLoaderOut(true)
      return
    }
    setPhase('playing')
    // the pieces are still invisible for the first second, so the loader stays up that long (live site: ~1.2s)
    const timer = setTimeout(() => setLoaderOut(true), 1200)
    return () => clearTimeout(timer)
  }, [assets, prepared])
  /* eslint-enable react-hooks/set-state-in-effect */

  const onPrepared = useCallback(() => setPrepared(true), [])
  const onDone = useCallback(() => {
    setIntroAttr('done') // synchronous: poster and canvas swap in the same frame
    setPhase('done')
  }, [])

  return (
    <>
      <Loader out={loaderOut} />
      <Navbar />
      <main>
        <Hero phase={phase} enabled={!REDUCED} onPrepared={onPrepared} onDone={onDone} />
      </main>
    </>
  )
}
