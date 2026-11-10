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
        const color = { 'leaf-deep':'#365e49', 'leaf-mid':'#4b7958', 'leaf-young':'#7d9c69', stem:'#697854', soil:'#574637', ceramic:'#f0ecdf', navy:'#6d87ad', linen:'#f2f0e5', brass:'#b3a58a', oak: '#f0eddf', edge: '#c2cfdf', frame: '#e4e9ed', metal: '#3254a4', fabric: '#f7f4e8', seam: '#b3c4d5', red: '#244ece', inside: '#fffbed', rubber: '#27498b' }[source.name] || '#eef1ee'
        const material = new MeshToonMaterial({ color: ['pencil-holder','sofa','small-bookcase','door'].includes(name) ? source.color : color, gradientMap, side: source.side })
        // Keep the tabletop legible; reserve dense blue for the room and metal details.
        material.userData.inkStrength = name === 'desk'
          ? (source.name === 'oak' ? .16 : source.name === 'edge' ? .24 : .5)
          : name === 'cabinet' ? .4 : name === 'plant' ? .2 : ['pencil-holder','sofa','small-bookcase','door'].includes(name) ? .3 : .65
        material.userData.nightUniform = night
        blueIllustration(material)
        materials.set(source, material)
      }
      node.material = materials.get(source)
      node.castShadow = true
      // The thin curved shell casts shadows but avoids self-shadow banding.
      node.receiveShadow = node.name !== 'curved-plywood-back' && !node.userData.noSelfShadow
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
      <Suspense fallback={null}><FurnitureAsset name="pencil-holder" position={[-2.7,.075,.65]} rotation={[0,.25,0]} /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="chair" position={[-.85,-1.39,-2.15]} rotation={[0,-.12,0]} /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="plant" position={[-5.55,-1.39,3.5]} rotation={[0,.3,0]} /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="cabinet" position={[-3.95,-1.39,5.5]} /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="sofa" position={[.6,-1.39,-6.25]} /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="small-bookcase" position={[-2.85,-1.39,-6.65]} /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="door" position={[-6.2,-1.39,-4.8]} rotation={[0,Math.PI/2,0]} /></Suspense>
      <Suspense fallback={null}><FurnitureAsset name="lamp" position={[-2.3, .075, -1.35]} /></Suspense>
    </group>
  )
}
