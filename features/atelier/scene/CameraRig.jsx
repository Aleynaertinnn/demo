import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

export default function CameraRig({ motion }) {
  useFrame(({ camera }) => {
    const { x, y, z, tx, ty, tz } = motion.current
    // Widen the lens on tall screens; dollying backward would cross the room walls.
    const framing = MathUtils.clamp(1.15 / camera.aspect, 1, 2.1)
    const near=MathUtils.lerp(.1,.008,MathUtils.smoothstep(motion.current.day||0,.1,.5))
    if(Math.abs(camera.near-near)>.0001){camera.near=near;camera.updateProjectionMatrix()}
    const walking=MathUtils.smoothstep(motion.current.day||0,.05,.3)*(1-MathUtils.smoothstep(motion.current.exterior||0,.35,.9))
    const approach=MathUtils.smoothstep(motion.current.y,2.3,3.1)
    const lens=MathUtils.lerp(MathUtils.lerp(47,39,approach),47,walking)
    const fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(lens / 2)) * framing))
    if (Math.abs(camera.fov - fov) > .01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    camera.position.set(x, y, z)
    camera.lookAt(tx,ty,tz)
    camera.updateMatrixWorld()
  })

  return null
}
