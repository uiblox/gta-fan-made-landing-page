// Scroll-scrubbed <video>: the page sets a 0..1 progress, the video seeks to that point of its length (one seek at a time).
// `span` squeezes the clip into the first part of the range and holds the last frame after it (short clips, see Services.jsx).
export function attachScrubVideo(video, src, span = 1) {
  const state = { target: 0, ready: false }
  const seek = () => {
    if (!state.ready || video.seeking) return
    if (Math.abs(video.currentTime - state.target) > 0.0005) video.currentTime = state.target
  }
  const onReady = () => {
    if (!video.duration) return
    state.ready = true
    video.classList.add('is-ready') // fades the video in over its poster
    seek()
  }
  video.addEventListener('loadeddata', onReady)
  video.addEventListener('seeked', seek)
  video.src = src
  video.load()
  return {
    set(progress) {
      state.target = Math.min(1, progress / span) * Math.max(0, (video.duration || 0) - 0.001)
      seek()
    },
    destroy() {
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('seeked', seek)
      video.removeAttribute('src')
      video.load()
    },
  }
}
