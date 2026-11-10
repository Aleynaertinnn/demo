import { Canvas } from '@react-three/fiber'
import { NoToneMapping, PCFShadowMap } from 'three'
import { IllustrationPalette } from '../materials/illustration'
import { atelierViews } from '../animation/camera-poses.mjs'
import AtelierScene from './AtelierScene'

export default function AtelierCanvas({ motion }) {
  return (
    <Canvas shadows={PCFShadowMap}
      gl={{ antialias: true, toneMapping: NoToneMapping, localClippingEnabled: true }}
      dpr={[1, 1.5]} camera={{ position: atelierViews[0].camera, fov: 47 }}
      fallback={<p className="fallback">3D önizleme için WebGL gerekir.</p>}>
      <color attach="background" args={['#e8edf0']} />
      <IllustrationPalette motion={motion}>
        <AtelierScene motion={motion} />
      </IllustrationPalette>
    </Canvas>
  )
}
