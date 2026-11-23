// Renditions of the scroll-scrubbed videos, built with Cloudinary URL transformations from the links in hosted-media.json.
// Every frame is kept (no fps change), a keyframe every 0.1s makes seeking cheap, audio is dropped, and portrait phones get a
// 9:16 crop that follows the subject (g_auto has to sit in its own transformation component). The poster is the first frame of the same crop.
import hosted from '/assets/hosted-media.json'

const PORTRAIT_CROP = 'c_fill,ar_9:16,w_720,g_auto'
const FILE = 'ac_none,vc_h264,ki_0.1,q_auto:good,f_mp4'

const withTransform = (url, ...parts) => url.replace('/upload/', `/upload/${parts.join('/')}/`)

export function videoSources(key) {
  const url = hosted[key].video
  return {
    landscape: withTransform(url, FILE),
    portrait: withTransform(url, PORTRAIT_CROP, FILE),
    posterLandscape: withTransform(url, 'so_0,f_jpg,q_auto').replace(/\.mp4$/, '.jpg'),
    posterPortrait: withTransform(url, PORTRAIT_CROP, 'so_0,f_jpg,q_auto').replace(/\.mp4$/, '.jpg'),
  }
}

// Portrait phones: same breakpoint as the live site's mobile + portrait.
export const PORTRAIT_PHONE = '(max-width: 767.98px) and (orientation: portrait)'
