import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, MathUtils } from 'three'
import { exteriorState } from '../animation/exterior-cycle.mjs'
import { dayState } from '../animation/day-cycle.mjs'
import { interiorBase } from '../geometry/interior.mjs'

const nightSky=new Color('#203a6a'),daySky=new Color('#d2e4ef'),warm=new Color('#ffca91'),sunlight=new Color('#fff9e6'),moonlight=new Color('#adc8ff')
export default function DaylightScene({motion}) {
  const sun=useRef(null),hemi=useRef(null),sky=useRef(null),city=useRef(null),lamps=useRef([]),windows=useRef([]),buildings=useRef([])
  useFrame(()=>{
    const value=motion.current.day||0,state=dayState(value),outside=exteriorState(motion.current.exterior||0)
    sun.current.position.set(9-value*12,6-value*4.5,-4.8-value*2)
    sun.current.intensity=MathUtils.lerp(2.15,.04,state.night)+outside.fill*.65
    sun.current.color.lerpColors(sunlight,warm,MathUtils.smoothstep(value,.25,.7)).lerp(moonlight,outside.fill)
    hemi.current.intensity=MathUtils.lerp(.8,.25,state.night)
    lamps.current.forEach(light=>{if(light)light.intensity=state.lamps*.14})
    const horizon=MathUtils.smoothstep(value,.8,.95)*outside.horizon
    city.current.visible=horizon>0
    sky.current.opacity=horizon
    buildings.current.forEach(material=>{if(material)material.opacity=horizon})
    sky.current.color.lerpColors(daySky,nightSky,state.night)
    windows.current.forEach(material=>{if(material)material.opacity=state.lamps*horizon})
  })
  return <>
    <hemisphereLight ref={hemi} args={['#e3efff','#4873d4',.8]} />
    {/* Include the entire facade and wall to keep the projected shadows continuous. */}
    <directionalLight ref={sun} position={[9,6,-4.8]} color="#fff9e6" intensity={2.15} castShadow
      shadow-mapSize={[4096,4096]} shadow-camera-left={-12} shadow-camera-right={12}
      shadow-camera-top={10} shadow-camera-bottom={-10} shadow-camera-near={.5} shadow-camera-far={40}
      shadow-normalBias={.012} shadow-bias={-.00005} />
    <group rotation={[0,.16,0]}>
      {[[-.44,.21],[.73,.035],[.94,.48],[-.27,.57]].map(([x,z],index)=><pointLight key={index} ref={node=>{lamps.current[index]=node}} position={[x,interiorBase+.22,z]} color="#ffbc76" intensity={0} distance={.85} decay={2} />)}
      <group ref={city} position={[0,interiorBase,0]} visible={false}>
        <mesh position={[.15,.15,.675]} rotation={[0,Math.PI,0]}><planeGeometry args={[1.65,.27]} /><meshBasicMaterial ref={sky} color="#d2e4ef" transparent opacity={0} depthWrite={false} /></mesh>
        {Array.from({length:15},(_,i)=>{
          const x=-.64+i*.11,h=.09+(i%4)*.035
          return <group key={i} position={[x,.04,.66]}>
            <mesh position={[0,h/2,0]}><boxGeometry args={[.07,h,.005]} /><meshBasicMaterial ref={node=>{buildings.current[i]=node}} color="#49688c" transparent opacity={0} /></mesh>
            {[0,1].map(row=><mesh key={row} position={[0,.06+row*.025,-.004]} rotation={[0,Math.PI,0]}>
              <planeGeometry args={[.012,.01]} /><meshBasicMaterial ref={node=>{windows.current[i*2+row]=node}} color="#ffe0a0" transparent opacity={0} />
            </mesh>)}
          </group>
        })}
      </group>
    </group>
  </>
}
