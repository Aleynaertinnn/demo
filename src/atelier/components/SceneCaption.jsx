import { journeyLabel } from '../animation/day-cycle.mjs'
import { interiorDesigns } from '../config/interior-designs.mjs'

export default function SceneCaption({ stage, interiorProgress, exteriorProgress, dayProgress, designIndex }) {
  if (stage < 4 || stage >= 8 || interiorProgress <= 70) return null

  let label = '04 / DÖRDÜNCÜ KAT'
  let title = 'Yaşamın içinden.'
  let description = 'Salon · Mutfak · Yatak odası · Çalışma alanı'

  if (stage === 5) {
    label = '05 / İÇ MEKÂN TASARIMLARI'
    title = interiorDesigns[designIndex].name
    description = interiorDesigns[designIndex].description
  } else if (stage === 6) {
    label = '06 / YAŞAM · GÜNÜN İÇİNDEN'
    title = journeyLabel(dayProgress / 100)
    description = dayProgress < 28
      ? 'Gün ışığı yerini sıcak aydınlatmalara bırakır.'
      : dayProgress < 68
        ? 'Yemek alanından geçerek salona ilerle.'
        : 'Salondaki ışığı izle, ardından pencereden dışarı çık.'
  } else if (stage === 7) {
    label = '07 / DIŞARIDAN · EVİN IŞIĞI'
    title = exteriorProgress > 85 ? 'Kâğıt Atölyesi' : 'İçeriden dışarıya.'
    description = exteriorProgress > 55
      ? 'Maketin çevresinde bir tur; camlar yerini buluyor.'
      : 'Ev kapanır, dışarıya açılırız.'
  }

  return <div className="interior-caption">
    <p className="index">{label}</p>
    <strong>{title}</strong>
    <p>{description}</p>
  </div>
}
