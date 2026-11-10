import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import { finalePaper } from '../config/layout.mjs'

export default function FinaleSheet({ motion }) {
  const stroke = useRef(null), light = useRef(null)
  useFrame(() => {
    const progress = motion.current.finale || 0
    const drawn = MathUtils.smoothstep(progress,.79,.96)
    stroke.current.visible = drawn > 0
    stroke.current.scale.x = Math.max(.00001,drawn)
    light.current.intensity = MathUtils.smoothstep(progress,.5,.8)*1.2
  })
  return <group name="new-sketch-sheet" position={finalePaper} rotation={[0,-.08,0]}>
    <mesh receiveShadow><boxGeometry args={[1.26,.006,.84]} /><meshStandardMaterial color="#f7f3e7" roughness={1} /></mesh>
    <group ref={stroke} position={[-.37,.004,0]} visible={false}>
      <mesh position={[.37,0,0]}><boxGeometry args={[.74,.001,.005]} /><meshBasicMaterial color="#2452c7" /></mesh>
    </group>
    <pointLight ref={light} position={[0,.8,0]} color="#fff0d1" intensity={0} distance={2.2} decay={2} />
  </group>
}
