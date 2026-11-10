import { MathUtils } from 'three'
export function exteriorState(progress) {
  return {
    close:MathUtils.smoothstep(progress,.28,.78),
    horizon:1-MathUtils.smoothstep(progress,0,.08),
    windows:MathUtils.smoothstep(progress,.18,.8),
    fill:MathUtils.smoothstep(progress,.35,1),
  }
}
