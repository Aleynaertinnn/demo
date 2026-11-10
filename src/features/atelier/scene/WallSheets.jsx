import { useEffect, useMemo } from 'react'
import { BufferGeometry, Vector3 } from 'three'
import { IllustrationMaterial } from '../materials/illustration'
import { projectLines } from '../config/project-plan.mjs'

const sheets = [
  [-1.10,.65,1.05,1.28,-.055], [.12,.62,1.18,1.02,.035], [1.45,.69,1.12,1.35,-.045], [2.79,.72,1.13,1.20,.07],
  [-1.16,1.91,1.14,1.32,.045], [.17,1.82,1.18,1.36,-.06], [1.57,1.99,1.25,1.35,.045], [2.96,1.95,1.13,1.24,-.05],
  [-.98,3.17,1.12,1.23,-.07], [.34,3.12,1.22,1.25,.035], [1.71,3.23,1.13,1.24,-.045], [3.02,3.15,1.15,1.18,.055],
  [3.84,2.65,.65,.82,-.08], [-1.48,3.99,.65,.44,.06],
]
function PinnedSheet({ data, index }) {
  const [x,y,width,height,angle]=data
  const geometry=useMemo(()=>{
    const points=[]
    const line=(x1,y1,x2,y2)=>points.push(new Vector3(x1,y1,-.004),new Vector3(x2,y2,-.004))
    const rectangle=(x,y,w,h)=>{line(x,y,x+w,y);line(x+w,y,x+w,y+h);line(x+w,y+h,x,y+h);line(x,y+h,x,y)}
    rectangle(-width/2,-height/2,width,height)
    if(index%4!==0) {
      if(index%3===0) {
        // Elevation studies echo the model's stacked storeys.
        const w=width*.53,h=height*.53
        rectangle(-w/2,-h/2,w,h)
        for(let i=1;i<7;i++)line(-w/2,-h/2+i*h/7,w/2,-h/2+i*h/7)
        for(let i=1;i<4;i++)line(-w/2+i*w/4,-h/2,-w/2+i*w/4,h/2)
      } else {
        for(const [a,b] of projectLines)line((a[0]-.15)*width*.42,-a[1]*height*.44,(b[0]-.15)*width*.42,-b[1]*height*.44)
        line(-width*.36,-height*.32,width*.36,-height*.32)
        for(let i=0;i<4;i++){const x=-width*.35+i*width*.23;line(x,-height*.30,x,-height*.34)}
      }
      rectangle(width*.1,-height*.43,width*.31,height*.06)
      for(let i=0;i<3;i++)line(-width*.36,-height*(.37+i*.025),-width*(.16+i*.03),-height*(.37+i*.025))
    }
    return new BufferGeometry().setFromPoints(points)
  },[width,height,index])
  useEffect(()=>()=>geometry.dispose(),[geometry])
  return <group position={[x,y,5.957-index*.001]} rotation={[0,0,angle]}>
    <mesh receiveShadow><boxGeometry args={[width,height,.004]} /><IllustrationMaterial color={index%3===0?'#f2efdf':'#faf6e8'} userData={{inkStrength:.55}} /></mesh>
    <lineSegments geometry={geometry}><lineBasicMaterial color="#62758b" transparent opacity={.48} depthWrite={false} /></lineSegments>
    <mesh position={[width*.06,height/2-.075,-.013]}>
      <sphereGeometry args={[.018,10,6]} /><IllustrationMaterial color="#5674a3" />
    </mesh>
    {index%5===0&&<mesh position={[-width*.25,height/2-.015,-.006]} rotation={[0,0,.1]}>
      <boxGeometry args={[.12,.045,.002]} /><IllustrationMaterial color="#d9d7c6" />
    </mesh>}
  </group>
}
export default function WallSheets(){
  return <group name="pinned-architectural-studies">{sheets.map((data,index)=><PinnedSheet key={index} data={data} index={index} />)}</group>
}
