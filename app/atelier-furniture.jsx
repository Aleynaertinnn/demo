import { Suspense, useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EdgesGeometry, LineBasicMaterial, LineSegments, MeshToonMaterial } from 'three'
import { useIllustrationRamp, blueIllustration, useNightUniform } from './illustration'

function FurnitureAsset({ name, position, rotation }) {
  const { scene } = useLoader(GLTFLoader, `/models/${name}.glb`)
  const gradientMap = useIllustrationRamp()
  const night = useNightUniform()
  const { model, ownedMaterials, outlines } = useMemo(() => {
    const model = scene.clone(true)
    const materials = new Map()
    const outlines = []
    const lineMaterial = new LineBasicMaterial({ color: '#405d89', transparent: true, opacity: .42, depthWrite: false })
    model.traverse(node => {
      if (!node.isMesh) return
      const source = node.material
      if (!materials.has(source)) {
        const color = { oak: '#f0eddf', edge: '#c2cfdf', frame: '#e4e9ed', metal: '#3254a4', fabric: '#f7f4e8', seam: '#b3c4d5', red: '#244ece', inside: '#fffbed', rubber: '#27498b' }[source.name] || '#eef1ee'
        const material = new MeshToonMaterial({ color, gradientMap })
        // Keep the tabletop legible; reserve dense blue for the room and metal details.
        material.userData.inkStrength = name === 'desk'
          ? (source.name === 'oak' ? .16 : source.name === 'edge' ? .24 : .5)
          : .65
        material.userData.nightUniform = night
        blueIllustration(material)
        materials.set(source, material)
      }
      node.material = materials.get(source)
      node.castShadow = true
      // The thin curved shell casts shadows but avoids self-shadow banding.
      node.receiveShadow = node.name !== 'curved-plywood-back'
      if (node.userData.contour) {
        const geometry = new EdgesGeometry(node.geometry, 38)
        const lines = new LineSegments(geometry, lineMaterial)
        outlines.push(geometry)
        node.add(lines)
      }
    })
    return { model, ownedMaterials: [...materials.values(), lineMaterial], outlines }
  }, [scene, gradientMap, name, night])
  useEffect(() => () => {
    ownedMaterials.forEach(material => material.dispose())
    outlines.forEach(geometry => geometry.dispose())
  }, [ownedMaterials, outlines])
  // Geometry stays in useLoader's cache; only this instance's materials are owned here.
  return <primitive object={model} position={position} rotation={rotation} dispose={null} />
}

export default function AtelierFurniture() {
  return (
    <group name="atelier-furniture">
      <Suspense fallback={null}><FurnitureAsset name="desk" /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="lamp" position={[-1.92, .075, -.8]} /></Suspense>
    </group>
  )
}
