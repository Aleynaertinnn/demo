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
