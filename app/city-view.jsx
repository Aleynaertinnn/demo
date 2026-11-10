import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BoxGeometry, BufferGeometry, Color, EdgesGeometry, Shape, ShapeGeometry, PlaneGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { dayState } from './day-cycle.mjs'

function buildCity(){
  const groups={far:[],near:[],tower:[],windows:[],lit:[]}
  const box=(kind,x,y,z,w,h,d)=>{const g=(kind==='windows'||kind==='lit')?new PlaneGeometry(w,h):new BoxGeometry(w,h,d);g.translate(x,y,z);groups[kind].push(g)}
  function building(kind,x,z,w,h,depth,seed){
    box(kind,x,(h-6)/2,z,w,h+6,depth)
    box(kind,x,h+.045,z,w+.04,.09,depth+.04)
    const columns=Math.max(2,Math.floor(w/.22))
    for(let row=0;row<Math.floor((h+5.7)/.28);row++)for(let col=0;col<columns;col++){
      const xx=x-w/2+(col+.5)*w/columns,yy=-5.8+row*.28
      box('windows',xx,yy,z+depth/2+.006,.065,.12,.008)
      if((row*3+col+seed)%5<2)box('lit',xx,yy,z+depth/2+.012,.06,.115,.006)
    }
  }
  box('far',0,-10,-14,180,20,.5)
  for(let i=0;i<25;i++)building('far',-22+i*1.85,-13,1.1+(i%3)*.18,3.3+(i*7%11)*.31,.9,i)
  for(let i=0;i<20;i++)building('near',-19+i*2,-3,1.3+(i%2)*.2,1.6+(i*3%7)*.23,1.05,i+11)
  // Art Deco setbacks and a stepped crown evoke Manhattan's landmark towers.
  const x=-1.7,z=-8
  building('tower',x,z,1.65,4.5,1.25,4)
  building('tower',x,z,1.22,5.45,1.0,7)
  box('tower',x,5.72,z,.9,.54,.78)
  box('tower',x,6.12,z,.64,.3,.58)
  box('tower',x,6.42,z,.39,.3,.4)
  box('tower',x,6.67,z,.2,.2,.22)
  box('tower',x,7.12,z,.055,.72,.055)
  for(const offset of [-.5,-.25,0,.25,.5])box('tower',x+offset,2.85,z+.644,.028,3.3,.025)
  return Object.fromEntries(Object.entries(groups).map(([kind,pieces])=>{
    const merged=mergeGeometries(pieces,false);pieces.forEach(g=>g.dispose());return [kind,merged]
  }))
}
const dayColors={far:'#b1c5d6',near:'#829eb9',tower:'#9eafbf',windows:'#6e8ba8',lit:'#b5c5d1'}
const nightColors={far:'#233b60',near:'#29456c',tower:'#456080',windows:'#294465',lit:'#ffda96'}
function CityBatch({kind,geometry,motion}){
  const material=useRef(null)
  const palette=useMemo(()=>[new Color(dayColors[kind]),new Color(nightColors[kind])],[kind])
  const edges=useMemo(()=>kind==='tower'?new EdgesGeometry(geometry,35):null,[geometry,kind])
  useEffect(()=>()=>edges?.dispose(),[edges])
  useFrame(()=>material.current.color.lerpColors(...palette,dayState(motion.current.day||0).night))
  return <mesh geometry={geometry}>
    <meshBasicMaterial ref={material} color={dayColors[kind]} />
    {edges&&<lineSegments geometry={edges}><lineBasicMaterial color="#5b7894" transparent opacity={.35} /></lineSegments>}
  </mesh>
}
function Cloud({position,scale,motion}){
  const material=useRef(null),line=useRef(null)
  const {geometry,outline}=useMemo(()=>{
    const shape=new Shape()
    shape.moveTo(-1,-.12);shape.bezierCurveTo(-1.05,.1,-.72,.16,-.56,.12)
    shape.bezierCurveTo(-.59,.51,-.12,.61,.12,.32)
    shape.bezierCurveTo(.42,.55,.75,.38,.74,.15)
    shape.bezierCurveTo(1,.14,1.06,-.05,.96,-.12)
    shape.bezierCurveTo(.3,-.19,-.5,-.2,-1,-.12)
    return {geometry:new ShapeGeometry(shape,18),outline:new BufferGeometry().setFromPoints(shape.getPoints(70).map(p=>new Vector3(p.x,p.y,.001)))}
  },[])
  const colors=useMemo(()=>[new Color('#fbfcf4'),new Color('#617997')],[])
  useEffect(()=>()=>{geometry.dispose();outline.dispose()},[geometry,outline])
  useFrame(()=>{const n=dayState(motion.current.day||0).night;material.current.color.lerpColors(...colors,n);material.current.opacity=1-n*.45;line.current.opacity=.3-n*.1})
  return <group position={position} scale={scale}>
    <mesh geometry={geometry}><meshBasicMaterial ref={material} color="#fbfcf4" transparent /></mesh>
    <line geometry={outline}><lineBasicMaterial ref={line} color="#7692ab" transparent opacity={.3} /></line>
  </group>
}
export default function CityView({motion}){
  const city=useMemo(buildCity,[]),sky=useRef(null)
  const uniforms=useMemo(()=>({night:{value:0}}),[])
  useEffect(()=>()=>Object.values(city).forEach(g=>g.dispose()),[city])
  useFrame(()=>{uniforms.night.value=dayState(motion.current.day||0).night})
  return <group name="manhattan-window-view" position={[14,-6.0,24]} rotation={[0,-Math.PI/2,0]}>
    <mesh position={[0,15,-50]}>
      <planeGeometry args={[180,100]} />
      <shaderMaterial ref={sky} uniforms={uniforms} depthWrite={false}
        vertexShader={'varying vec2 skyUV; void main(){skyUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'}
        fragmentShader={'varying vec2 skyUV; uniform float night; void main(){float h=smoothstep(.25,.8,skyUV.y);vec3 daylight=mix(vec3(.76,.87,.93),vec3(.32,.55,.77),h);vec3 evening=mix(vec3(.095,.16,.28),vec3(.018,.04,.10),h);gl_FragColor=vec4(mix(daylight,evening,night),1.0);\n#include <colorspace_fragment>\n}'} />
    </mesh>
    {Object.entries(city).map(([kind,geometry])=><CityBatch key={kind} kind={kind} geometry={geometry} motion={motion} />)}
    {[[-12,7.1,-12,1.3],[-5.4,9.0,-15,1.1],[2.5,7.7,-11,1.05],[8.4,6.8,-12,1.6],[15,9.2,-16,1.4]].map(([x,y,z,size],i)=><Cloud key={i} position={[x,y+3.2,z]} scale={[size,size*.7,1]} motion={motion} />)}
  </group>
}
