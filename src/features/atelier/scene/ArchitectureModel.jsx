import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EdgesGeometry, MathUtils, Plane, Vector3 } from 'three'
import { IllustrationMaterial } from '../materials/illustration'
import { projectLines } from '../config/project-plan.mjs'
import { exteriorState, glazingState } from '../animation/exterior-cycle.mjs'
import { dayState } from '../animation/day-cycle.mjs'
import InteriorModel from './InteriorModel'
import { openingState, interiorBase, interiorLevel } from '../geometry/interior.mjs'
import { createArchitecture } from '../geometry/architecture.mjs'

function ModelBatch({ geometry, kind, finish, clippingPlanes, motion, level }) {
  const material = useRef(null)
  const mesh = useRef(null)
  const glazing = kind.startsWith('recess') || kind === 'glazing-frame'
  useFrame(()=>{
    if(!glazing)return
    const installed=glazingState(motion.current.exterior||0,level)
    mesh.current.visible=installed>.001
    mesh.current.position.y=(1-installed)*.065
    material.current.opacity=installed
    if(!kind.startsWith('recess'))return
    const outside=exteriorState(motion.current.exterior||0)
    const strength={recess:1,'recess-dim':.18,'recess-warm':.6}[kind]
    material.current.emissive.set('#ffca8c')
    material.current.emissiveIntensity=outside.windows*.55*strength
  })
  const edges = useMemo(() => kind === 'card' ? new EdgesGeometry(geometry, 35) : null, [geometry, kind])
  useEffect(() => () => edges?.dispose(), [edges])
  const colors = { card: finish, frame: '#b8c9da', 'glazing-frame':'#b8c9da', recess: '#cedee9', 'recess-dim':'#bdcddd', 'recess-warm':'#d8e0e6', rail: '#6983ac', foliage: '#9caf9d' }
  return (
    <mesh ref={mesh} geometry={geometry} visible={!glazing} castShadow={!glazing} receiveShadow={kind === 'card'}>
      <IllustrationMaterial ref={material} transparent={glazing} opacity={glazing?0:1} depthWrite={!kind.startsWith('recess')} color={colors[kind]} userData={{ inkStrength: kind === 'card' ? .32 : .65 }} clippingPlanes={clippingPlanes} clipShadows />
      {edges && <lineSegments geometry={edges}><lineBasicMaterial color="#58749d" clippingPlanes={clippingPlanes} transparent opacity={.32} depthWrite={false} /></lineSegments>}
    </mesh>
  )
}

export default function ArchitectureModel({ motion, finish }) {
  const parts = useRef([])
  const clippingPlanes = useMemo(() => [new Plane(new Vector3(0,-1,0),interiorBase+.286)],[])
  const stages = useMemo(() => createArchitecture(projectLines), [])
  useEffect(() => () => stages.forEach(part => Object.values(part.batches).forEach(geometry => geometry.dispose())), [stages])
  useFrame(() => {
    const opened=openingState(motion.current.open || 0)
    clippingPlanes[0].constant=interiorBase+MathUtils.lerp(opened.cut,.285,dayState(motion.current.day||0).enclosure)+.0001
    stages.forEach((stage,index) => {
      const part=parts.current[index]
      if(!part)return
      const amount=MathUtils.smoothstep(motion.current.build,stage.start,stage.end)
      part.visible=amount>0
      part.scale.y=Math.max(.00001,amount)
      const level=stage.name.startsWith('storey-') ? Number(stage.name.split('-')[1])-1 : -1
      const upper=level>interiorLevel || stage.name==='removable-roof'
      part.position.set(upper?opened.slide:0,stage.y+(upper?opened.lift:0),0)
    })
  })
  return <group name="opening-architecture">{stages.map((stage,index)=>(
    <group key={stage.name} name={stage.name} position={[0,stage.y,0]} visible={false} ref={node=>{parts.current[index]=node}}>
      {Object.entries(stage.batches).map(([kind,geometry])=><ModelBatch key={kind} kind={kind} geometry={geometry} finish={finish} motion={motion} level={stage.name.startsWith('storey-')?Number(stage.name.split('-')[1])-1:0} clippingPlanes={stage.name === 'storey-4' ? clippingPlanes : undefined} />)}
    </group>
  ))}<InteriorModel motion={motion} /></group>
}
