import { MathUtils } from 'three'

export default function FinaleCaption({ stage, finaleProgress, replay }) {
  if (stage !== 8 || finaleProgress <= 80) return null

  return <div className="finale-caption" style={{ opacity: MathUtils.smoothstep(finaleProgress / 100, .80, .97) }}>
    <p className="index">08 / YENİ BİR ÇİZGİ</p>
    <h2>Her mekân,<br />bir çizgiyle başlar.</h2>
    <button onClick={replay}>Yeniden başla ↗</button>
  </div>
}
