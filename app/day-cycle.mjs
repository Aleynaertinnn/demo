import { MathUtils } from 'three'
export function dayState(value) {
  const progress=MathUtils.clamp(value,0,1)
  return {
    night:MathUtils.smoothstep(progress,.55,1),
    lamps:MathUtils.smoothstep(progress,.6,.9),
    enclosure:MathUtils.smoothstep(progress,.32,.68),
    label:progress<.35?'Sabah ışığı':progress<.65?'Uzayan gölgeler':progress<.85?'Gün batımı':'Akşamın içinden',
  }
}

// Reach evening at the dining table, then walk through the apartment at night.
export function journeyTime(progress) { return MathUtils.smoothstep(progress,0,.32) }
export function journeyLabel(progress) {
  if(progress<.28)return dayState(journeyTime(progress)).label
  if(progress<.48)return 'Yemek alanında akşam'
  if(progress<.68)return 'Salona doğru'
  if(progress<.9)return 'Oturma odasında'
  return 'Pencerenin önünde'
}
