import './hero-intro.css'

export default function HeroIntro() {
  return (
    <div className="intro">
      <p className="intro-note intro-note-left">MİMARİ BİR FİKİR <span aria-hidden="true">↗</span></p>
      <div className="intro-copy">
        <h1>Bir çizgiden<br />bir mekâna.</h1>
      </div>
      <p className="intro-note intro-note-right"><span aria-hidden="true">↖</span> ESKİZDEN YAŞAMA</p>
    </div>
  )
}
