import { Suspense, useEffect, useMemo } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { MeshToonMaterial, PMREMGenerator } from 'three'
import { atelierLayout } from './atelier-layout.mjs'
import { blueIllustration, useIllustrationRamp, useNightUniform } from './illustration'

function WindowAsset() {
  const { scene } = useLoader(GLTFLoader, '/models/window.glb')
  const gl = useThree(state => state.gl)
  const gradientMap = useIllustrationRamp()
  const night = useNightUniform()
  const { model, materials, reflection } = useMemo(() => {
    const room = new RoomEnvironment()
    const generator = new PMREMGenerator(gl)
    const reflection = generator.fromScene(room, .04)
    generator.dispose()
    room.dispose()
    const model = scene.clone(true), cache = new Map()
    model.traverse(node => {
      if (!node.isMesh) return
      const source = node.material
      if (!cache.has(source)) {
        const material = source.name === 'glass' ? source.clone() : new MeshToonMaterial({
          color: source.name === 'aluminium' ? '#4266b5' : '#6a82ad', gradientMap,
        })
        if (source.name === 'glass') {
          material.envMap = reflection.texture
          material.envMapIntensity = .45
        } else {
          material.userData.inkStrength = .45
          material.userData.nightUniform = night
          blueIllustration(material)
        }
        cache.set(source, material)
      }
      node.material = cache.get(source)
      // Transparent panes must not turn the window into an opaque shadow caster.
      node.castShadow = /^(mullion|transom|interior-sill)/.test(node.name)
      node.receiveShadow = !node.userData.glazing
      if (node.userData.glazing) node.renderOrder = 1
    })
    return { model, materials: [...cache.values()], reflection }
  }, [scene, gl, gradientMap, night])
  useEffect(() => () => {
    materials.forEach(material => material.dispose())
    reflection.dispose()
  }, [materials, reflection])
  return <primitive object={model} position={[atelierLayout.windowX, atelierLayout.floor, -.5]} dispose={null} />
}

export default function AtelierWindow() {
  return <Suspense fallback={null}><WindowAsset /></Suspense>
}
