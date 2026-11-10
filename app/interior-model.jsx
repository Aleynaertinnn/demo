import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, EdgesGeometry, MathUtils } from 'three'
import { IllustrationMaterial } from './illustration'
import { createInterior, interiorBase } from './interior-geometry.mjs'
import { dayState } from './day-cycle.mjs'
import { interiorDesigns, designWeight } from './interior-designs.mjs'

function InteriorBatch({ kind, geometry, design = null, motion }){
  const material=useRef(null)
  const edges=useMemo(()=>new EdgesGeometry(geometry,38),[geometry])
  const palette=useMemo(()=>interiorDesigns.map(style=>new Color(style.colors[kind])),[kind])
  useEffect(()=>()=>edges.dispose(),[edges])
  useFrame(()=>{
    const evening=dayState(motion.current.day||0).lamps
    material.current.emissive.set(kind==='lamp'?'#ffbf70':'#000000')
    material.current.emissiveIntensity=evening*.9
    if(design!==null)return
    const value=MathUtils.clamp(motion.current.design || 0,0,2),index=Math.min(1,Math.floor(value))
    material.current.color.lerpColors(palette[index],palette[index+1],value-index)
  })
  return <mesh geometry={geometry} castShadow receiveShadow>
    <IllustrationMaterial ref={material} color={interiorDesigns[design??0].colors[kind]} userData={{inkStrength:.15}} />
    <lineSegments geometry={edges}><lineBasicMaterial color="#6683a3" transparent opacity={.27} depthWrite={false} /></lineSegments>
  </mesh>
}
export default function InteriorModel({motion}){
  const root=useRef(null),variants=useRef([])
  const structure=useMemo(()=>createInterior(0,'structure'),[])
  const furniture=useMemo(()=>interiorDesigns.map((_,index)=>createInterior(index,'furniture')),[])
  useEffect(()=>()=>[structure,...furniture].forEach(batches=>Object.values(batches).forEach(g=>g.dispose())),[structure,furniture])
  useFrame(()=>{
    const amount=MathUtils.smoothstep(motion.current.build,.54,.6)
    root.current.visible=amount>0
    root.current.scale.y=Math.max(.00001,amount)
    variants.current.forEach((part,index)=>{
      const weight=designWeight(index,motion.current.design||0)
      part.visible=weight>0
      part.scale.y=Math.max(.00001,weight)
    })
  })
  return <group name="fourth-storey-interior" position={[0,interiorBase,0]} ref={root} visible={false}>
    {Object.entries(structure).map(([kind,geometry])=><InteriorBatch key={kind} kind={kind} geometry={geometry} motion={motion} />)}
    {furniture.map((batches,index)=><group key={index} name={`design-${interiorDesigns[index].id}`} ref={node=>{variants.current[index]=node}}>
      {Object.entries(batches).map(([kind,geometry])=><InteriorBatch key={kind} kind={kind} geometry={geometry} design={index} motion={motion} />)}
    </group>)}
  </group>
}
