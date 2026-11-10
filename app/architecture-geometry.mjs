import { BoxGeometry, CylinderGeometry, DodecahedronGeometry } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

import { floorHeight, modelBase, storeys, grid, cells, footprints } from './project-plan.mjs'
export { floorHeight, modelBase, storeys } from './project-plan.mjs'
const { x: x0, z: z0, width: cellX, depth: cellZ } = grid
const key = (x, z) => `${x}:${z}`

export function createArchitecture(projectLines) {
  const stages = []
  function stage(name, y, start, end) {
    const value = { name, y, start, end, batches: {} }
    stages.push(value)
    return value
  }
  function add(part, material, geometry) {
    // Match attributes for merging curved foliage, rods and boxes.
    const flat = geometry.index ? geometry.toNonIndexed() : geometry.clone()
    geometry.dispose()
    ;(part.batches[material] ||= []).push(flat)
  }
  function box(part, material, x, y, z, width, height, depth, angle = 0) {
    const geometry = new BoxGeometry(width, height, depth)
    geometry.rotateY(angle); geometry.translate(x,y,z)
    add(part,material,geometry)
  }
  function lineBox(part, material, a, b, bottom, height, thickness) {
    const dx=b[0]-a[0], dz=b[1]-a[1]
    box(part,material,(a[0]+b[0])/2,bottom+height/2,(a[1]+b[1])/2,Math.hypot(dx,dz),height,thickness,-Math.atan2(dz,dx))
  }
  function wall(part, a, b, openings = true) {
    const length=Math.hypot(b[0]-a[0],b[1]-a[1])
    const point=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]
    if(!openings) {lineBox(part,'card',a,b,.018,.267,.012);return}
    const bays=Math.max(1,Math.round(length/.24))
    // Sills, headers and piers leave genuine voids through the cardboard wall.
    lineBox(part,'card',a,b,.018,.066,.016)
    lineBox(part,'card',a,b,.231,.054,.016)
    for(let i=0;i<=bays;i++) {
      const t=i/bays, half=.018/length
      lineBox(part,'card',point(Math.max(0,t-half)),point(Math.min(1,t+half)),.084,.147,.016)
    }
    for(let i=0;i<bays;i++) {
      const left=point((i+.14)/bays),right=point((i+.86)/bays)
      const pane=['recess','recess-dim','recess-warm'][Math.abs(i+part.name.length+Math.round(a[0]*10))%3]
      lineBox(part,pane,left,right,.09,.132,.002)
      lineBox(part,'frame',left,right,.083,.006,.022)
      lineBox(part,'frame',left,right,.226,.004,.014)
      const middle=point((i+.5)/bays)
      lineBox(part,'frame',middle,[middle[0]+.002,middle[1]+.002],.086,.141,.006)
    }
  }
  const order=[projectLines.length-1,...projectLines.slice(0,-1).map((_,i)=>i)]
  order.forEach((index,i)=> {
    const part=stage(`plan-wall-${index}`,modelBase,i*.012,i*.012+.105)
    // Start precisely on the last ink stroke; all partition door gaps are retained.
    if(index === 2) {
      const [a,b]=projectLines[index]
      wall(part,a,[.64,.63]); wall(part,[.38,.63],b)
      lineBox(part,'card',[.38,.63],[.64,.63],.231,.054,.016)
    }
    else if(index<4) wall(part,...projectLines[index])
    else lineBox(part,'card',...projectLines[index],0,floorHeight,.01)
  })
  function slab(part, footprint) {
    cells.forEach(([x,z])=>{
      if(footprint.has(key(x,z)))box(part,'card',x0+(x+.5)*cellX,.009,z0+(z+.5)*cellZ,cellX,.018,cellZ)
    })
  }
  function railing(part,a,b) {
    lineBox(part,'rail',a,b,.103,.005,.005)
    lineBox(part,'rail',a,b,.027,.003,.004)
    const count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.028)
    for(let i=0;i<=count;i++)box(part,'rail',a[0]+(b[0]-a[0])*i/count,.065,a[1]+(b[1]-a[1])*i/count,.003,.08,.003)
  }
  function boundaries(part, footprint, fn) {
    cells.forEach(([x,z])=>{
      if(!footprint.has(key(x,z)))return
      const l=x0+x*cellX,r=l+cellX,n=z0+z*cellZ,s=n+cellZ
      if(!footprint.has(key(x-1,z)))fn(part,[l,n],[l,s])
      if(!footprint.has(key(x+1,z)))fn(part,[r,s],[r,n])
      if(!footprint.has(key(x,z-1)))fn(part,[r,n],[l,n])
      if(!footprint.has(key(x,z+1)))fn(part,[l,s],[r,s])
    })
  }
  for(let level=1;level<storeys;level++) {
    const part=stage(`storey-${level+1}`,modelBase+level*floorHeight,.25+(level-1)*.1,.34+(level-1)*.1)
    const current=footprints[level],previous=footprints[level-1]
    // A thin floor plate extends under each terrace and its balustrade.
    const deck=new Set([...current,...previous])
    slab(part,deck)
    boundaries(part,current,wall)
    const terraces=new Set([...deck].filter(cell=>!current.has(cell)))
    boundaries(part,terraces,(part,a,b)=>railing(part,a,b))
    cells.forEach(([x,z])=>{
      if(!terraces.has(key(x,z)))return
      for(let board=1;board<7;board++) box(part,'frame',x0+(x+.5)*cellX,.019,z0+z*cellZ+board*cellZ/7,cellX-.024,.001,.002)
      box(part,'card',x0+(x+.5)*cellX,.045,z0+(z+.25)*cellZ,.13,.05,.065)
      box(part,'foliage',x0+(x+.5)*cellX,.075,z0+(z+.25)*cellZ,.115,.012,.05)
    })
    // Separate recessed circulation core and landing, ready for a future cutaway.
    box(part,'card',.1,.144,-.12,.012,.25,.32)
    for(let step=0;step<9;step++)box(part,'card',-.06,.018+step*.014,-.23+step*.025,.17,.014,.025)
  }
  const roof=stage('removable-roof',modelBase+storeys*floorHeight,.87,.95)
  slab(roof,footprints.at(-1))
  boundaries(roof,footprints.at(-1),(part,a,b)=>lineBox(part,'card',a,b,.018,.034,.012))
  box(roof,'frame',.42,.022,-.17,.27,.005,.24)
  for(const x of [.31,.42,.53])box(roof,'card',x,.029,-.17,.008,.008,.24)
  const site=stage('landscape-and-entrance',modelBase,.93,1)
  for(let step=0;step<3;step++)box(site,'card',.45,.008+step*.006,.69+step*.034,.25,.012,.034)
  for(const [x,z,scale] of [[-.93,.69,1],[1.24,.49,.85],[1.24,-.45,.8],[-.94,-.57,.75]]) {
    const trunk=new CylinderGeometry(.009,.013,.16*scale,6);trunk.translate(x,.08*scale,z);add(site,'frame',trunk)
    for(const [dx,dy,dz,r] of [[0,.2,0,.095],[-.055,.17,.025,.065],[.045,.235,-.01,.065]]) {
      const crown=new DodecahedronGeometry(r*scale,0);crown.scale(1,.8,1);crown.translate(x+dx*scale,dy*scale,z+dz*scale);add(site,'foliage',crown)
    }
    box(site,'card',x,.013,z,.23,.018,.23)
  }
  return stages.map(part=>({...part,batches:Object.fromEntries(Object.entries(part.batches).map(([material,pieces])=>{
    const geometry=mergeGeometries(pieces,false)
    pieces.forEach(piece=>piece.dispose())
    geometry.computeBoundingSphere()
    return [material,geometry]
  }))}))
}
