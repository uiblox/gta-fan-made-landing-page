import { BLOG, LINKS } from '../content'
import { ArrowIcon } from './Card'
import post1 from '/assets/site/blog/post-1.avif'
import post2 from '/assets/site/blog/post-2.avif'
import post3 from '/assets/site/blog/post-3.avif'

const ART = [post1, post2, post3]

// Blog (live: Featured News). Three posts in the same rail as the project cards.
export default function Blog() {
  return (
    <section className="listing" aria-labelledby="blog-title">
      <div className="listing__head">
        <h2 className="listing__title listing__title--pink" id="blog-title">{BLOG.title}</h2>
        <a className="listing__link listing__link--lilac" href={LINKS.blog}>{BLOG.link}<ArrowIcon /></a>
      </div>
      <div className="rail rail--three">
        {BLOG.posts.map((p, i) => (
          <div className="rail__col" key={p.title}>
            <a className="news" href={LINKS[p.link]}>
              <div className="news__img"><img src={ART[i]} alt="" loading="lazy" /></div>
              <div className="news__text">
                <h3 className="news__title">{p.title}</h3>
                <p className="news__date">{p.date}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
