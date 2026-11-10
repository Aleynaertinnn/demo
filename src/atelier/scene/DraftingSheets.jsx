import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, CanvasTexture, Vector3, SRGBColorSpace } from 'three'
import { IllustrationMaterial } from '../materials/illustration'
import { paperOffset } from '../config/layout.mjs'
import { projectLines, floorHeight, storeys, grid, footprints, perimeter } from '../config/project-plan.mjs'
export { projectLines } from '../config/project-plan.mjs'

const ink = '#274b80', guide = '#8c9eaf', paper = '#faf7eb'
function segments(lines) {
  return new BufferGeometry().setFromPoints(lines.flatMap(([a,b])=>[new Vector3(a[0],0,a[1]),new Vector3(b[0],0,b[1])]))
}
function DrawingLines({ lines, color = ink, opacity = 1, height = 0 }) {
  const geometry=useMemo(()=>segments(lines),[lines])
  useEffect(()=>()=>geometry.dispose(),[geometry])
  return <lineSegments geometry={geometry} position={[0,height,0]}><lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} /></lineSegments>
}
function rectangle(lines,x,z,w,d) {
  lines.push([[x,z],[x+w,z]],[[x+w,z],[x+w,z+d]],[[x+w,z+d],[x,z+d]],[[x,z+d],[x,z]])
}
function arc(lines,x,z,r,start,end) {
  for(let i=0;i<20;i++) {
    const a=start+(end-start)*i/20,b=start+(end-start)*(i+1)/20
    lines.push([[x+Math.cos(a)*r,z+Math.sin(a)*r],[x+Math.cos(b)*r,z+Math.sin(b)*r]])
  }
}
const details=[], dimensions=[], projected=[], paperGrid=[]
for(let x=-1.3;x<=1.6;x+=.1125)paperGrid.push([[x,-.84],[x,.9]])
for(let z=-.84;z<=.9;z+=.1125)paperGrid.push([[-1.3,z],[1.6,z]])
dimensions.push([[1.32,-.48],[1.32,-.66]],[[1.32,-.66],[1.30,-.61]],[[1.32,-.66],[1.34,-.61]])
for(let i=0;i<=4;i++) {
  dimensions.push([[-1.02+i*.08,.80],[-1.02+i*.08,.82]])
  if(i<4)dimensions.push([[-1.02+i*.08,.81],[-.94+i*.08,.81]])
}
// Column axes and chain dimensions use the same structural grid as the seven-storey model.
for(let i=0;i<=4;i++) {
  const x=grid.x+i*grid.width
  for(let z=-.86;z<.85;z+=.07)dimensions.push([[x,z],[x,z+.028]])
  dimensions.push([[x,-.63],[x,-.83]],[[x-.018,-.792],[x+.018,-.828]])
  arc(dimensions,x,-.87,.023,0,Math.PI*2)
}
for(let i=0;i<=3;i++) {
  const z=grid.z+i*grid.depth
  dimensions.push([[.99,z],[1.18,z]],[[1.132,z-.018],[1.168,z+.018]])
}
dimensions.push([[-.72,-.81],[1.02,-.81]],[[1.15,-.66],[1.15,.68]], [[-.76,.78],[1.03,.78]])
// Doors are real gaps in the model: the arcs and leaves mark those exact openings.
for(const [x,z,r,a,b] of [[.15,-.18,.25,0,Math.PI/2],[-.26,.07,.22,-Math.PI/2,0],[.56,.27,.21,-Math.PI/2,0],[.38,.63,.26,-Math.PI/2,0]]) {
  arc(details,x,z,r,a,b)
  details.push([[x,z],[x+Math.cos(a)*r,z+Math.sin(a)*r]])
}
// Stair flight, landing and direction arrow coincide with the model circulation core.
rectangle(details,-.145,-.255,.17,.29)
for(let step=0;step<=9;step++)details.push([[-.145,-.23+step*.025],[.025,-.23+step*.025]])
details.push([[-.06,-.22],[-.06,-.01]],[[-.06,-.01],[-.08,-.04]],[[-.06,-.01],[-.04,-.04]])
// Furnishing symbols, sanitary fixtures and floor hatching.
rectangle(details,-.55,-.48,.32,.22);rectangle(details,-.535,-.465,.065,.19)
rectangle(details,-.49,-.12,.23,.1)
rectangle(details,.28,-.48,.36,.18)
for(const x of [.32,.42,.52,.62])rectangle(details,x,-.51,.055,.035)
rectangle(details,.72,.36,.16,.19);arc(details,.8,.46,.045,0,Math.PI*2)
for(let i=0;i<8;i++)details.push([[.19+i*.042,.34],[.19+i*.042,.59]])
// Ground-floor window frames follow the same bay spacing as the facade generator.
for(const [a,b] of projectLines.slice(0,4)) {
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.max(1,Math.round(length/.24))
  for(let i=0;i<count;i++) {
    const t=(i+.5)/count,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t
    if(Math.abs(z-.63)<.001 && x>.38 && x<.64)continue
    if(a[0]===b[0])rectangle(details,x-.012,z-.055,.024,.11)
    else rectangle(details,x-.055,z-.012,.11,.024)
  }
}
// Dashed upper-floor projections reveal the setbacks that become terraces.
for(const [a,b] of perimeter(footprints.at(-1))) {
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.ceil(length/.035)
  for(let i=0;i<count;i+=2)projected.push([[a[0]+(b[0]-a[0])*i/count,a[1]+(b[1]-a[1])*i/count],[a[0]+(b[0]-a[0])*(i+1)/count,a[1]+(b[1]-a[1])*(i+1)/count]])
}
function PlanLabels() {
  const {texture,redraw,family}=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024
    const ctx=canvas.getContext('2d')
    const family=getComputedStyle(document.documentElement).getPropertyValue('--font-notes').trim() || 'cursive'
    const text=(value,x,z,size=17)=>{ctx.font=`${size}px ${family}, cursive`;ctx.fillStyle='#395b83';ctx.fillText(value,(x+1.4)/3.1*1536,(z+.94)/1.9*1024)}
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace
    const redraw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height)
      text('KAGIT ATOLYESI / 07 KAT',-.55,.91,19)
      text('ZEMIN KAT PLANI',-.55,.86,18);text('1:100   /   A-01',.57,.86,16)
      for(let i=0;i<4;i++)text('4.125',grid.x+(i+.29)*grid.width,-.83,15)
      text('16.50',-.01,-.92,16);text('12.40',1.19,.02,16)
      text('SALON',-.5,-.27,16);text('YASAM / 24 m2',.29,-.12,15);text('GIRIS',.27,.49,14)
      text('N',1.3,-.68,20);text('0     2     4 m',-.98,.85,14)
      texture.needsUpdate=true
    }
    redraw()
    return {texture,redraw,family}
  },[])
  useEffect(()=>{
    let active=true
    document.fonts.load(`17px ${family}`).then(()=>{if(active)redraw()})
    return ()=>{active=false;texture.dispose()}
  },[texture,redraw,family])
  return <mesh position={[.15,.209,.01]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.1,1.9]} /><meshBasicMaterial map={texture} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1} /></mesh>
}

export function ProjectSketch({ motion }) {
  const strokes=useRef([]),detail=useRef(null)
  useFrame(()=>{
    strokes.current.forEach((stroke,index)=>{
      if(!stroke)return
      const amount=Math.min(1,Math.max(0,motion.current.sketch*projectLines.length-index))
      stroke.visible=amount>0;stroke.scale.x=Math.max(.00001,amount)
    })
    if(detail.current)detail.current.visible=motion.current.sketch>.35
  })
  return <group name="architectural-plan" position={[0,paperOffset,0]}>
    <DrawingLines lines={paperGrid} color="#b4c4cc" opacity={.24} height={.200} />
    <DrawingLines lines={dimensions} color={guide} opacity={.6} height={.204} />
    <group ref={detail} visible={false}>
      <DrawingLines lines={details} color={ink} opacity={.8} height={.208} />
      <DrawingLines lines={projected} color={guide} opacity={.7} height={.208} />
      <PlanLabels />
    </group>
    {projectLines.map(([[x,z],[endX,endZ]],index)=>{
      const length=Math.hypot(endX-x,endZ-z),offset=index<4?.008:.005
      const lines=[]
      const spans=index===2?[[0,.335],[.595,length]]:[[0,length]]
      for(const [a,b] of spans)for(const side of [-offset,offset])lines.push([[a,side],[b,side]])
      return <group key={index} position={[x,.207,z]} rotation={[0,-Math.atan2(endZ-z,endX-x),0]}>
        <group ref={node=>{strokes.current[index]=node}} visible={false}><DrawingLines lines={lines} /></group>
      </group>
    })}
  </group>
}

function Sheet({ position, angle, elevation = false, roof = false }) {
  const lines=useMemo(()=>{
    const lines=[]
    rectangle(lines,-.46,-.33,.92,.66)
    if(elevation) {
      // Seven floors, the same height-to-width ratio and facade bays as the model.
      const scale=.27,bottom=.25
      for(let level=0;level<=storeys;level++){
        const z=bottom-level*floorHeight*scale
        lines.push([[-.23,z],[.23,z]])
        if(level===storeys)continue
        for(let bay=0;bay<8;bay++)rectangle(lines,-.22+bay*.055,z-.06,.03,.04)
      }
      lines.push([[-.23,bottom],[-.23,bottom-storeys*floorHeight*scale]],[[.23,bottom],[.23,bottom-storeys*floorHeight*scale]])
    } else {
      const source=roof?perimeter(footprints.at(-1)):projectLines
      for(const [a,b] of source)lines.push([[a[0]*.45-.065,a[1]*.45],[b[0]*.45-.065,b[1]*.45]])
      if(!roof)for(const [a,b] of details)lines.push([[a[0]*.45-.065,a[1]*.45],[b[0]*.45-.065,b[1]*.45]])
      else for(let x=-.28;x<.31;x+=.07)lines.push([[x,-.22],[x,.2]])
    }
    rectangle(lines,.1,.27,.34,.045)
    for(let i=0;i<5;i++)lines.push([[-.42+i*.07,.29],[-.385+i*.07,.29]])
    return lines
  },[elevation,roof])
  return <group position={position} rotation={[0,angle,0]}>
    <mesh receiveShadow><boxGeometry args={[1.02,.012,.77]} /><IllustrationMaterial color={paper} userData={{ inkStrength: .18 }} /></mesh>
    <DrawingLines lines={lines} opacity={.7} height={.009} />
  </group>
}
export default function DraftingSheets(){
  return <>
    <Sheet position={[-1.55,.079,-.9]} angle={0} />
    <Sheet position={[1.6,.079,-1.1]} angle={-.08} elevation />
    <Sheet position={[1.7,.079,.78]} angle={.24} roof />
  </>
}
