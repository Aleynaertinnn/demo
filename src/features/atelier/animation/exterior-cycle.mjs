import { MathUtils } from 'three'
export function exteriorState(progress) {
  return {
    close:MathUtils.smoothstep(progress,.28,.54),
    horizon:1-MathUtils.smoothstep(progress,0,.08),
    windows:MathUtils.smoothstep(progress,.55,1),
    fill:MathUtils.smoothstep(progress,.35,1),
  }
}

// Install complete panes and their frames floor by floor during the final orbit.
export function glazingState(progress, level = 0) {
  return MathUtils.smoothstep(progress,.55+level*.043,.64+level*.043)
}
