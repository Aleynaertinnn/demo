import { modelPaths } from '../../features/atelier/config/assets.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { deskLayout, atelierLayout } from '../../features/atelier/config/layout.mjs'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

// GLTFExporter uses the browser FileReader API; these assets have no external textures.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.() }) }
}
const palette = Object.fromEntries(Object.entries({
  oak: '#d6b78a', edge: '#a47750', frame: '#744333', metal: '#653b30',
  'leaf-deep':'#365e49', 'leaf-mid':'#4b7958', 'leaf-young':'#7d9c69', stem:'#697854', soil:'#574637', ceramic:'#eee9dd', navy: '#31527f', linen: '#ece5d4', brass: '#b39a69', fabric: '#e7d5b3', seam: '#b39570', red: '#a34d35', inside: '#f2dfb7', rubber: '#4d382e',
}).map(([name, color]) => [name, new T.MeshStandardMaterial({ name, color, roughness: .9 })]))
function mesh(parent, name, geometry, material, position = [0, 0, 0], contour = false) {
  const part = new T.Mesh(geometry, palette[material])
  part.name = name; part.position.set(...position)
  part.castShadow = true; part.receiveShadow = true
  part.userData.contour = contour
  parent.add(part)
  return part
}
function rounded(parent, name, size, material, position, radius = .025) {
  return mesh(parent, name, new RoundedBoxGeometry(...size, 3, radius), material, position, true)
}
function rod(parent, name, points, radius, material, tubularSegments = 20) {
  const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)))
  return mesh(parent, name, new T.TubeGeometry(curve, tubularSegments, radius, 8, false), material)
}
function cylinder(parent, name, top, bottom, height, material, position) {
  return mesh(parent, name, new T.CylinderGeometry(top, bottom, height, 24), material, position)
}
function joint(parent, name, position, radius = .055) {
  const part = cylinder(parent, name, radius, radius, .055, 'metal', position)
  part.rotation.x = Math.PI / 2
  const bolt = cylinder(parent, `${name}-bolt`, radius * .32, radius * .32, .061, 'edge', position)
  bolt.rotation.x = Math.PI / 2
}

function desk() {
  const { width, depth, centerZ } = deskLayout
  const model = new T.Group(); model.name = 'Drafting-desk'
  model.userData.dimensions = { width, depth, centerZ }
  rounded(model, 'rounded-oak-top', [width,.14,depth], 'oak', [0,0,centerZ], .035)
  rounded(model, 'laminated-edge', [width-.04,.012,depth-.04], 'edge', [0,-.048,centerZ], .006)
  // Two trestles support a wide, shallow drafting desk without stretching the tube gauges.
  for(const x of [-width/2+.65,width/2-.65]) {
    for(const side of [-1,1]) {
      const z=centerZ+side*(depth/2-.4)
      rod(model,`splayed-leg-${x}-${side}`,[[x,-.08,z],[x,-.7,z+side*.1],[x,-1.34,z+side*.22]],.055,'frame')
      rounded(model,`foot-${x}-${side}`,[.15,.045,.2],'rubber',[x,-1.365,z+side*.22],.015)
      joint(model,`top-fastener-${x}-${side}`,[x,-.13,z],.04)
    }
    rounded(model,`trestle-${x}`,[.11,.085,depth-.4],'frame',[x,-.92,centerZ],.018)
    rounded(model,`top-rail-${x}`,[.13,.085,depth-.3],'edge',[x,-.11,centerZ],.015)
  }
  for(const z of [centerZ-.7,centerZ+.7])rod(model,`long-stretcher-${z}`,[[-width/2+.65,-1,z],[0,-1,z],[width/2-.65,-1,z]],.035,'frame')
  return model
}

// Closed, gently curved plywood shell, including the thin perimeter faces.
function backShell() {
  const vertices = [], indices = [], columns = 20, rows = 18
  for (let side = 0; side < 2; side++) {
    for (let row = 0; row <= rows; row++) {
      const v = row / rows
      for (let col = 0; col <= columns; col++) {
        const u = col / columns * 2 - 1
        const width = .46 - .04 * v + .025 * Math.sin(v * Math.PI)
        vertices.push(u * width, .86 + v * .95, -.33 - v * .19 + u * u * .1 + side * .038)
      }
    }
  }
  const stride = columns + 1, layer = stride * (rows + 1)
  const quad = (a,b,c,d) => indices.push(a,b,d,b,c,d)
  for (let row=0; row<rows; row++) for (let col=0; col<columns; col++) {
    const a=row*stride+col
    quad(a,a+stride,a+stride+1,a+1)
    quad(a+layer,a+layer+1,a+layer+stride+1,a+layer+stride)
  }
  for (let col=0;col<columns;col++) {
    quad(col,col+1,col+1+layer,col+layer)
    const a=rows*stride+col;quad(a,a+layer,a+layer+1,a+1)
  }
  for (let row=0;row<rows;row++) for (const col of [0,columns]) {
    const a=row*stride+col
    if (col === 0) quad(a,a+layer,a+layer+stride,a+stride)
    else quad(a,a+stride,a+stride+layer,a+layer)
  }
  const geometry=new T.BufferGeometry()
  geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  return geometry
}
function chair() {
  const model = new T.Group(); model.name = 'Studio-chair'
  rounded(model,'seat-plywood',[1.02,.065,.95],'edge',[0,.77,0],.03)
  rounded(model,'seat-cushion',[.98,.13,.91],'fabric',[0,.85,.015],.06)
  mesh(model,'curved-plywood-back',backShell(),'fabric')
  for (const sign of [-1,1]) {
    rod(model,`back-piping-${sign}`,Array.from({length:19},(_,i)=>{
      const v=i/18
      return [sign*(.46-.04*v+.025*Math.sin(v*Math.PI)),.86+v*.95,-.33-v*.19+.1+.018]
    }),.007,'seam')
    rod(model,`cantilever-frame-${sign}`,[[sign*.43,.8,.32],[sign*.47,.15,.42],[sign*.47,.055,.3],[sign*.47,.055,-.48],[sign*.43,.8,-.36],[sign*.4,1.36,-.42]],.026,'metal',36)
    rod(model,`arm-support-${sign}`,[[sign*.46,.79,.28],[sign*.55,1.11,.25],[sign*.55,1.16,-.27]],.018,'metal')
    rounded(model,`armrest-${sign}`,[.12,.055,.67],'edge',[sign*.55,1.16,-.01],.025)
    for(const z of [-.35,.28]) rounded(model,`glide-${sign}-${z}`,[.075,.025,.14],'rubber',[sign*.47,.025,z],.01)
  }
  rod(model,'back-top-piping',Array.from({length:21},(_,i)=>{
    const u=i/20*2-1;return [u*.42,1.81,-.52+u*u*.1+.018]
  }),.007,'seam')
  return model
}
function lamp() {
  const model = new T.Group(); model.name = 'Articulated-lamp'
  cylinder(model,'weighted-base',.18,.22,.05,'red',[0,.025,0])
  cylinder(model,'base-inset',.15,.15,.008,'edge',[0,.055,0])
  cylinder(model,'swivel',.045,.055,.09,'metal',[0,.1,0])
  for (const z of [-.035,.035]) {
    rod(model,`lower-parallel-arm-${z}`,[[0,.13,z],[-.14,.72,z]],.014,'metal')
    rod(model,`upper-parallel-arm-${z}`,[[-.14,.72,z],[.49,1.13,z]],.013,'metal')
  }
  joint(model,'elbow',[-.14,.72,0]);joint(model,'head-hinge',[.49,1.13,0],.04)
  rod(model,'power-cable',[[0,.07,.06],[-.12,.3,.07],[-.18,.68,.07],[.1,.91,.07],[.49,1.1,.07]],.006,'rubber',28)
  // A small visible tension spring between the lower arm struts.
  const spring=[]
  for(let i=0;i<=120;i++) {const t=i/120;spring.push([-.045-t*.055+Math.cos(t*Math.PI*20)*.016,.26+t*.24,.055+Math.sin(t*Math.PI*20)*.016])}
  rod(model,'tension-spring',spring,.0035,'edge',120)
  const shade=new T.Group();shade.position.set(.52,1.05,0);shade.rotation.z=-.32;model.add(shade)
  const profile=[[.035,.08],[.06,.07],[.09,.015],[.19,-.12],[.195,-.135],[.181,-.135],[.175,-.118],[.075,.012],[.044,.055]].map(([r,y])=>new T.Vector2(r,y))
  mesh(shade,'spun-metal-shade',new T.LatheGeometry(profile,32),'red')
  const lip=mesh(shade,'shade-rim',new T.TorusGeometry(.188,.006,6,32),'edge',[0,-.13,0]);lip.rotation.x=Math.PI/2
  mesh(shade,'bulb',new T.SphereGeometry(.038,12,8),'inside',[0,-.025,0])
  return model
}

function cabinet() {
  const model=new T.Group();model.name='Atelier-library'
  model.userData.dimensions={width:3.78,height:5.46,depth:.68}
  rounded(model,'recessed-plinth',[3.55,.1,.55],'navy',[0,.05,.025],.015)
  rounded(model,'inset-back-panel',[3.66,5.27,.025],'navy',[0,2.75,.305],.008)
  for(const x of [-1.85,1.85])rounded(model,`outer-stile-${x}`,[.065,5.36,.66],'oak',[x,2.78,0],.012)
  for(const y of [.13,1.16,5.43])rounded(model,`continuous-rail-${y}`,[3.76,.06,.68],'oak',[0,y,0],.01)
  for(const x of [-.73,.69])rounded(model,`open-bay-divider-${x}`,[.04,4.18,.62],'edge',[x,3.28,.015],.008)
  // Quiet lower storage, with recessed finger pulls and a softly rounded counter.
  for(let i=0;i<4;i++) {
    const x=-1.395+i*.93
    rounded(model,`lower-door-${i}`,[.9,.95,.045],'linen',[x,.65,-.3],.012)
    rounded(model,`finger-pull-${i}`,[.22,.012,.016],'brass',[x,.99,-.33],.004)
  }
  const bays=[{x:-1.29,w:1.06,levels:[1.19,2.02,2.92,4.16,5.4]},
    {x:-.02,w:1.37,levels:[1.19,2.15,3.7,4.62,5.4]},
    {x:1.28,w:1.11,levels:[1.19,2.52,3.35,4.48,5.4]}]
  const books=new T.Group();model.add(books)
  function book(name,x,y,width,height,color,lean=0) {
    const group=new T.Group();group.position.set(x,y, -.07);group.rotation.z=lean;books.add(group)
    mesh(group,`${name}-pages`,new T.BoxGeometry(width-.015,height-.025,.27),'inside',[0,height/2,0])
    for(const sign of [-1,1])mesh(group,`${name}-cover-${sign}`,new T.BoxGeometry(.008,height,.29),color,[sign*(width/2-.004),height/2,0])
    mesh(group,`${name}-spine`,new T.BoxGeometry(width,height,.012),color,[0,height/2,-.14])
    mesh(group,`${name}-label`,new T.BoxGeometry(width*.55,.014,.002),'linen',[0,height*.72,-.147])
  }
  bays.forEach((bay,column)=>{
    bay.levels.slice(1,-1).forEach((y,index)=>rounded(model,`shelf-${column}-${index}`,[bay.w,.045,.61],'oak',[bay.x,y,.005],.008))
    bay.levels.slice(0,-1).forEach((bottom,row)=>{
      if((column===1&&row===1)||(column===2&&row===0))return
      const count=[3,2,4,2][(row+column)%4]
      for(let i=0;i<count;i++) {
        const h=.38+((row*3+i+column)%4)*.075
        book(`book-${column}-${row}-${i}`,bay.x-bay.w/2+.14+i*.135,bottom+.027,.085+(i%2)*.015,h,['linen','navy','edge'][(i+column+row)%3],i===count-1?-.08:0)
      }
    })
  })
  // A generous central display niche breaks the repetitive book grid.
  rounded(model,'display-niche-floor',[1.33,.018,.58],'linen',[-.02,2.185,-.005],.006)
  const vaseProfile=[[.105,0],[.13,.03],[.14,.19],[.10,.29],[.065,.34],[.065,.43],[.05,.43],[.05,.34]].map(([r,y])=>new T.Vector2(r,y))
  mesh(model,'ceramic-vase',new T.LatheGeometry(vaseProfile,32),'linen',[-.34,2.20,-.06])
  const arch=mesh(model,'sculptural-arch',new T.TorusGeometry(.18,.035,8,28,Math.PI),'brass',[.29,2.31,-.06])
  rounded(model,'arch-plinth',[.49,.055,.24],'linen',[.29,2.22,-.04],.008)
  // Flat archival boxes, paper trays and a horizontal stack give each bay a distinct use.
  for(let i=0;i<3;i++) {
    rounded(model,`archive-box-${i}`,[.72,.15,.40],i===1?'navy':'linen',[1.22,1.3+i*.17,-.015],.009)
    rounded(model,`archive-label-${i}`,[.18,.035,.004],'edge',[1.22,1.3+i*.17,-.218],.003)
  }
  for(let i=0;i<3;i++)rounded(model,`horizontal-folio-${i}`,[.5,.045,.31],i===1?'navy':'linen',[-1.0,3.0+i*.05,-.03],.004)
  rounded(model,'empty-display-tray',[.48,.04,.35],'edge',[.29,3.75,-.01],.008)
  // Batch only the books; named cabinet panels remain independently editable in Blender.
  model.updateMatrixWorld(true)
  const batches=new Map()
  books.traverse(node=>{
    if(!node.isMesh)return
    const geometry=node.geometry.toNonIndexed();geometry.applyMatrix4(node.matrixWorld)
    const list=batches.get(node.material)||[];list.push(geometry);batches.set(node.material,list)
  })
  model.remove(books)
  for(const [material,pieces] of batches){
    const geometry=mergeGeometries(pieces,false);pieces.forEach(g=>g.dispose())
    const batch=new T.Mesh(geometry,material);batch.name=`library-books-${material.name}`;model.add(batch)
  }
  books.traverse(node=>{if(node.isMesh)node.geometry.dispose()})
  return model
}

function plant() {
  const model=new T.Group();model.name='Ficus-office-plant'
  model.userData.species='Ficus elastica — stylized rubber plant'
  const profile=[[.21,0],[.24,.025],[.28,.12],[.32,.56],[.325,.64],[.315,.67],[.292,.67],[.288,.63],[.28,.57],[.245,.1],[.21,.07]].map(([r,y])=>new T.Vector2(r,y))
  mesh(model,'ceramic-planter',new T.LatheGeometry(profile,48),'ceramic')
  cylinder(model,'recessed-soil',.281,.281,.025,'soil',[0,.612,0])
  cylinder(model,'planter-foot',.19,.20,.018,'ceramic',[0,.009,0])
  for(let i=0;i<15;i++) {
    const angle=i*2.399,r=.07+(i%4)*.048
    const pebble=new T.DodecahedronGeometry(.012+(i%3)*.003,0)
    pebble.scale(1,.45,1);pebble.translate(Math.cos(angle)*r,.63,Math.sin(angle)*r)
    mesh(model,`soil-pebble-${i}`,pebble,i%4===0?'ceramic':'soil')
  }
  rod(model,'main-woody-stem',[[0,.62,0],[-.025,1.1,.015],[.035,1.7,-.01],[.005,2.35,.035]],.015,'stem',28)
  rod(model,'secondary-woody-stem',[[.015,.62,.01],[.1,1.05,.045],[.13,1.53,.02],[.19,1.9,.04]],.011,'stem',24)
  const leafMaterials=['leaf-deep','leaf-mid','leaf-deep','leaf-young']
  leafMaterials.forEach(name=>{palette[name].side=T.DoubleSide})
  for(let index=0;index<17;index++) {
    const secondary=index%4===0
    const y=secondary?.97+Math.floor(index/4)*.17:.86+index*.085
    const angle=index*2.399+.3
    const length=.43+(index%4)*.045-(index>12?.1:0)
    const width=.135+(index%3)*.018
    const base=new T.Vector3(secondary?.13:Math.sin(y*4)*.025,y,secondary?.03:.015)
    const reach=.12+(index%3)*.025
    const end=base.clone().add(new T.Vector3(Math.cos(angle)*reach,.05,Math.sin(angle)*reach))
    rod(model,`petiole-${index}`,[base.toArray(),base.clone().lerp(end,.5).add(new T.Vector3(0,.02,0)).toArray(),end.toArray()],.0045,'stem',8)
    const group=new T.Group();group.name=`leaf-cluster-${index}`;group.position.copy(end)
    group.rotation.set(.22+(index%3)*.16,angle, index%2===0?-.85:1.05)
    model.add(group)
    const point=(t,u)=>{
      const breadth=Math.max(.0006,Math.pow(Math.sin(Math.PI*t),.78)*width*(1+.07*Math.sin(t*9+index)))
      const ridge=(1-u*u)*.025*Math.sin(Math.PI*t)
      return new T.Vector3(u*breadth,length*(t-.16*t*t),length*.38*t*t+u*u*.035*Math.sin(Math.PI*t)+ridge)
    }
    const positions=[],uvs=[],indices=[],rows=18,cols=12
    for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++) {
      const t=row/rows,u=col/cols*2-1,p=point(t,u)
      positions.push(p.x,p.y,p.z);uvs.push(col/cols,t)
    }
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++) {
      const a=row*(cols+1)+col,b=a+cols+1
      indices.push(a,a+1,b,a+1,b+1,b)
    }
    const geometry=new T.BufferGeometry()
    geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2))
    geometry.setIndex(indices);geometry.computeVertexNormals()
    const leaf=mesh(group,`leaf-surface-${index}`,geometry,leafMaterials[index%4])
    leaf.userData.noSelfShadow=true
    // Raised midrib and gently arcing side veins follow the curved surface.
    const midrib=Array.from({length:16},(_,i)=>point(i/15,0).add(new T.Vector3(0,0,.002)).toArray())
    rod(group,`leaf-midrib-${index}`,midrib,.0018,'leaf-young',18)
    for(const t of [.23,.39,.55,.71])for(const side of [-1,1]) {
      const points=[point(t,0),point(t+.045,side*.45),point(t+.1,side*.84)].map(p=>p.add(new T.Vector3(0,0,.002)).toArray())
      rod(group,`leaf-vein-${index}-${t}-${side}`,points,.0007,'leaf-mid',5)
    }
  }
  // Consolidate fine veins by material; keep every leaf surface individually editable.
  model.updateMatrixWorld(true)
  const batches=new Map(),remove=[]
  model.traverse(node=>{
    if(!node.isMesh || !node.name.startsWith('leaf-vein'))return
    const geometry=node.geometry.toNonIndexed();geometry.applyMatrix4(node.matrixWorld)
    const list=batches.get(node.material)||[];list.push(geometry);batches.set(node.material,list);remove.push(node)
  })
  for(const node of remove){node.removeFromParent();node.geometry.dispose()}
  for(const [material,pieces] of batches){
    const geometry=mergeGeometries(pieces,false);pieces.forEach(g=>g.dispose())
    const veins=new T.Mesh(geometry,material);veins.name='leaf-secondary-veins';veins.userData.noSelfShadow=true;model.add(veins)
  }
  return model
}

function seatedArchitect() {
  const model=new T.Group();model.name='Seated-male-architect'
  for(const [name,color] of Object.entries({'figure-shirt':'#f1eee3','figure-jacket':'#94a9c3','figure-beard':'#a3afbb','figure-skin':'#e8e4d8','figure-hair':'#9dabbc','figure-trousers':'#b7c7d9','figure-ink':'#44628f','figure-shoes':'#778ca9'})) {
    palette[name]=new T.MeshStandardMaterial({name,color,roughness:.85})
  }
  const oval=(parent,name,position,scale,material)=>{
    const part=mesh(parent,name,new T.SphereGeometry(1,28,20),material,position)
    part.scale.set(...scale);return part
  }
  // Varying elliptical sections create continuous clothing and tapered limbs.
  const sweep=(parent,name,points,radii,material)=>{
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)))
    const positions=[],indices=[],segments=28,sides=16
    for(let i=0;i<=segments;i++) {
      const t=i/segments,p=curve.getPoint(t),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),curve.getTangent(t).normalize())
      const at=t*(radii.length-1),j=Math.min(Math.floor(at),radii.length-2),f=at-j
      const rx=T.MathUtils.lerp(radii[j][0],radii[j+1][0],f),rz=T.MathUtils.lerp(radii[j][1],radii[j+1][1],f)
      for(let k=0;k<=sides;k++) {
        const a=k/sides*Math.PI*2,v=new T.Vector3(Math.cos(a)*rx,0,Math.sin(a)*rz).applyQuaternion(q).add(p)
        positions.push(v.x,v.y,v.z)
        if(i<segments&&k<sides){const n=i*(sides+1)+k;indices.push(n,n+sides+1,n+1,n+1,n+sides+1,n+sides+2)}
      }
    }
    for(const [ring,reverse] of [[0,true],[segments,false]]) {
      const center=positions.length/3,p=curve.getPoint(ring/segments);positions.push(p.x,p.y,p.z)
      for(let k=0;k<sides;k++){const a=ring*(sides+1)+k;indices.push(center,reverse?a+1:a,reverse?a:a+1)}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals()
    return mesh(parent,name,g,material)
  }
  oval(model,'seated-hips',[0,1.015,.005],[.285,.16,.225],'figure-trousers')
  for(const side of [-1,1]) {
    sweep(model,`trouser-leg-${side}`,[[side*.15,1.01,.04],[side*.17,.96,.36],[side*.18,.85,.61],[side*.19,.46,.64],[side*.20,.12,.72]],[[.14,.14],[.145,.13],[.11,.105],[.075,.075]],'figure-trousers')
    oval(model,`loafer-${side}`,[side*.20,.075,.81],[.105,.075,.205],'figure-shoes')
    rod(model,`trouser-crease-${side}`,[[side*.15,1.135,.12],[side*.17,1.075,.36],[side*.18,.94,.61]],.0025,'figure-ink',12)
  }
  sweep(model,'structured-jacket',[[0,1.02,0],[0,1.35,.025],[0,1.7,.075],[0,1.98,.12]],[[.28,.19],[.29,.18],[.36,.19],[.38,.175]],'figure-jacket')
  oval(model,'shoulder-line',[0,1.94,.12],[.40,.155,.19],'figure-jacket')
  const panel=(name,points,material,z)=>{
    const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath()
    return mesh(model,name,new T.ExtrudeGeometry(shape,{depth:.006,bevelEnabled:true,bevelSize:.003,bevelThickness:.002,bevelSegments:2}),material,[0,0,z])
  }
  panel('crew-neck-shirt-inset',[[-.08,1.2],[.08,1.2],[.11,1.9],[.08,2.015],[-.08,2.015],[-.11,1.9]],'figure-shirt',.294)
  for(const side of [-1,1]) {
    panel(`jacket-collar-${side}`,[[side*.085,2.025],[side*.18,2.015],[side*.30,1.86],[side*.145,1.88],[side*.09,1.76]],'figure-jacket',.307)
    rod(model,`zipper-edge-${side}`,[[side*.078,1.21,.21],[side*.092,1.55,.272],[side*.11,1.82,.307]],.004,'figure-shirt',15)
    rod(model,`chest-pocket-${side}`,[[side*.17,1.72,.279],[side*.24,1.71,.264],[side*.29,1.73,.243]],.004,'figure-ink',12)
  }
  sweep(model,'neck',[[0,1.96,.13],[0,2.16,.17]],[[.10,.09],[.095,.087]],'figure-skin')
  // The head tilts down toward the page; facial details stay understated.
  const head=new T.Group();head.name='architect-head';head.position.set(0,2.35,.20);head.scale.setScalar(1.16);head.rotation.x=.16;model.add(head)
  oval(head,'face',[0,0,.025],[.15,.205,.14],'figure-skin')
  oval(head,'jaw',[0,-.105,.052],[.132,.105,.108],'figure-skin')
  oval(head,'nose-bridge',[0,-.007,.155],[.023,.048,.035],'figure-skin')
  oval(head,'nose-tip',[0,-.041,.177],[.032,.023,.027],'figure-skin')
  oval(head,'chin',[0,-.165,.087],[.074,.044,.065],'figure-skin')
  // Close-cropped beard follows the jaw with an open area around the lips.
  for(const side of [-1,1]) {
    oval(head,`moustache-${side}`,[side*.022,-.078,.164],[.029,.009,.006],'figure-beard')
    rod(head,`eyebrow-${side}`,[[side*.028,.065,.155],[side*.065,.073,.15],[side*.101,.061,.132]],.006,'figure-beard',12)
    oval(head,`eye-${side}`,[side*.064,.028,.155],[.019,.005,.005],'figure-ink')
  }
  const beardPositions=[],beardIndices=[],beardRows=18,beardCols=36
  for(let row=0;row<=beardRows;row++)for(let col=0;col<=beardCols;col++) {
    const a=-1.45+col/beardCols*2.9
    const top=-.132+.092*Math.pow(Math.abs(a)/1.45,.7)
    const y=T.MathUtils.lerp(top,-.198,row/beardRows)
    const r=Math.sqrt(Math.max(.015,1-Math.pow((y+.105)/.105,2)))
    beardPositions.push(.134*r*Math.sin(a),y,.052+.111*r*Math.cos(a))
    if(row<beardRows&&col<beardCols){const n=row*(beardCols+1)+col;beardIndices.push(n,n+beardCols+1,n+1,n+1,n+beardCols+1,n+beardCols+2)}
  }
  const beard=new T.BufferGeometry();beard.setAttribute('position',new T.Float32BufferAttribute(beardPositions,3));beard.setIndex(beardIndices);beard.computeVertexNormals()
  mesh(head,'close-trimmed-beard',beard,'figure-beard')
  rod(head,'mouth',[[-.037,-.105,.156],[0,-.109,.165],[.037,-.105,.156]],.0025,'figure-beard',12)
  // A continuous scalp follows the forehead, temples and nape without strand overlays.
  const hairPositions=[],hairIndices=[],hairRings=22,hairSides=48
  for(let row=0;row<=hairRings;row++)for(let col=0;col<=hairSides;col++) {
    const a=col/hairSides*Math.PI*2
    const hairline=1.48-.53*Math.cos(a)
    const theta=.001+row/hairRings*hairline
    hairPositions.push(Math.sin(a)*.153*Math.sin(theta),.025+.187*Math.cos(theta),.022+Math.cos(a)*.143*Math.sin(theta))
    if(row<hairRings&&col<hairSides){const n=row*(hairSides+1)+col;hairIndices.push(n,n+hairSides+1,n+1,n+1,n+hairSides+1,n+hairSides+2)}
  }
  const scalp=new T.BufferGeometry();scalp.setAttribute('position',new T.Float32BufferAttribute(hairPositions,3));scalp.setIndex(hairIndices);scalp.computeVertexNormals()
  mesh(head,'close-cropped-hair',scalp,'figure-hair')
  const eyeglassOutline=(path,s=1)=>{
    path.moveTo(-.052*s,.035*s);path.quadraticCurveTo(-.063*s,.034*s,-.060*s,.020*s)
    path.lineTo(-.048*s,-.027*s);path.quadraticCurveTo(-.045*s,-.038*s,-.032*s,-.039*s)
    path.lineTo(.029*s,-.039*s);path.quadraticCurveTo(.043*s,-.038*s,.047*s,-.025*s)
    path.lineTo(.060*s,.020*s);path.quadraticCurveTo(.063*s,.034*s,.050*s,.035*s)
    path.quadraticCurveTo(0,.043*s,-.052*s,.035*s);path.closePath();return path
  }
  const frameShape=eyeglassOutline(new T.Shape())
  frameShape.holes.push(eyeglassOutline(new T.Path(),.79))
  const frameGeometry=new T.ExtrudeGeometry(frameShape,{depth:.008,steps:1,bevelEnabled:true,bevelThickness:.0015,bevelSize:.0015,bevelSegments:2,curveSegments:10})
  for(const side of [-1,1]) {
    oval(head,`ear-${side}`,[side*.14,-.015,.01],[.023,.045,.027],'figure-skin')
    const frame=mesh(head,`wayfarer-frame-${side}`,frameGeometry,'figure-ink',[side*.070,.007,.16]);frame.rotation.y=side*.10
    rod(head,`glasses-temple-${side}`,[[side*.127,.029,.165],[side*.151,.027,.09],[side*.156,.015,.025],[side*.152,-.014,.005]],.006,'figure-ink',16)
    oval(head,`frame-hinge-${side}`,[side*.127,.03,.167],[.008,.004,.003],'figure-shirt')
  }
  rod(head,'spectacle-bridge',[[-.019,.020,.17],[0,.029,.179],[.019,.020,.17]],.006,'figure-ink',12)
  for(const side of [-1,1]) {
    const elbow=[side*.43,1.44,.34],wrist=side===1?[.38,1.485,.93]:[-.31,1.485,.87]
    sweep(model,`rolled-sleeve-${side}`,[[side*.34,1.94,.12],[side*.43,1.69,.22],elbow],[[.14,.135],[.125,.12],[.10,.09]],'figure-jacket')
    sweep(model,`forearm-${side}`,[elbow,[side*.40,1.46,.58],wrist],[[.086,.08],[.074,.065],[.05,.045]],'figure-skin')
    oval(model,`hand-${side}`,[wrist[0],1.482,wrist[2]+.055],[.065,.035,.085],'figure-skin')
    for(let finger=0;finger<4;finger++) {
      const x=wrist[0]+(finger-1.5)*.025,z=wrist[2]+.09
      rod(model,`finger-${side}-${finger}`,[[x,1.49,z],[x,1.479,z+.043],[x+.004,1.465,z+.06]],.011,'figure-skin',10)
    }
    rod(model,`thumb-${side}`,[[wrist[0]-side*.047,1.49,wrist[2]+.025],[wrist[0]-side*.07,1.50,wrist[2]+.06],[wrist[0]-side*.04,1.50,wrist[2]+.095]],.015,'figure-skin',10)
    rod(model,`shirt-seam-${side}`,[[side*.22,1.1,-.17],[side*.25,1.5,-.15],[side*.32,1.82,-.06]],.002,'figure-ink',14)
  }
  const pencil=cylinder(model,'held-drawing-pencil',.008,.008,.25,'figure-ink',[.37,1.575,1.035]);pencil.rotation.z=-.12
  rod(model,'crew-neck-trim',[[-.09,2.02,.26],[-.07,1.99,.30],[0,1.98,.307],[.07,1.99,.30],[.09,2.02,.26]],.008,'figure-shirt',20)
  // Named shoulder pivots preserve the authored pose and support scroll-driven gestures.
  for(const side of [-1,1]) {
    const arm=new T.Group();arm.name=side===1?'architect-drawing-arm':'architect-resting-arm';arm.position.set(side*.34,1.94,.12);model.add(arm)
    model.updateMatrixWorld(true)
    for(const part of [...model.children]) {
      if(part===arm)continue
      if(part.name===`rolled-sleeve-${side}`||part.name===`forearm-${side}`||part.name===`hand-${side}`||part.name===`thumb-${side}`||part.name.startsWith(`finger-${side}-`)||(side===1&&part.name==='held-drawing-pencil')) arm.attach(part)
    }
  }
  model.userData.pose='Seated on chair.glb, facing +Z, floor at Y=0; desk surface at Y=1.465.'
  return model
}

function officeDoor() {
  const model=new T.Group();model.name='Atelier-office-door'
  for(const [name,color] of Object.entries({'door-panel':'#eeeadd','door-trim':'#7e98ba','door-edge':'#c2ceda','door-metal':'#5474a6'})) {
    palette[name]=new T.MeshStandardMaterial({name,color,roughness:.65,metalness:name==='door-metal'?.45:0})
  }
  // Floor at Y=0; the interior face is +Z. The clear wall opening is 1.65 × 3.15.
  for(const side of [-1,1]) {
    rounded(model,`jamb-${side}`,[.09,3.18,.18],'door-trim',[side*.80,1.59,0],.009)
    rounded(model,`architrave-${side}`,[.11,3.24,.035],'door-edge',[side*.845,1.62,.108],.007)
  }
  rounded(model,'head-jamb',[1.69,.09,.18],'door-trim',[0,3.135,0],.009)
  rounded(model,'top-architrave',[1.80,.11,.035],'door-edge',[0,3.245,.108],.007)
  rounded(model,'door-leaf',[1.50,3.065,.065],'door-panel',[0,1.555,.025],.012)
  rounded(model,'recessed-face-panel',[1.28,2.76,.008],'door-edge',[0,1.57,.062],.008)
  rounded(model,'inset-cream-face',[1.25,2.73,.007],'door-panel',[0,1.57,.069],.006)
  for(const y of [.42,1.57,2.72]) {
    const hinge=cylinder(model,`hinge-${y}`,.017,.017,.095,'door-metal',[-.751,y,.066])
    hinge.userData.contour=true
  }
  const rose=cylinder(model,'handle-rosette',.043,.043,.014,'door-metal',[.59,1.49,.081]);rose.rotation.x=Math.PI/2
  rod(model,'lever-handle',[[.59,1.49,.091],[.59,1.49,.14],[.48,1.49,.14],[.42,1.49,.135]],.014,'door-metal',16)
  rounded(model,'keyhole',[.012,.035,.008],'door-metal',[.59,1.37,.071],.005)
  rounded(model,'threshold',[1.59,.014,.18],'door-edge',[0,.007,0],.003)
  model.userData.dimensions={openingWidth:1.65,openingHeight:3.15}
  return model
}

function smallBookcase() {
  const model=new T.Group();model.name='Compact-office-bookcase'
  for(const [name,color] of Object.entries({'shelf-ivory':'#f0ecdf','shelf-blue':'#9fb3cb','shelf-paper':'#e3e8e8','shelf-ink':'#5474a6'})) {
    palette[name]=new T.MeshStandardMaterial({name,color,roughness:.8})
  }
  const bookBox=(parent,name,size,material,position)=>mesh(parent,name,new T.BoxGeometry(...size),material,position,true)
  // Floor origin; the open shelving faces +Z, matching the sofa orientation.
  rounded(model,'recessed-plinth',[1.30,.10,.42],'shelf-ink',[0,.07,0],.012)
  rounded(model,'inset-back',[1.38,1.65,.025],'shelf-blue',[0,.98,-.245],.008)
  for(const side of [-1,1])rounded(model,`side-panel-${side}`,[.055,1.76,.53],'shelf-ivory',[side*.71,.98,0],.012)
  for(const [index,y] of [.12,.68,1.24,1.86].entries())rounded(model,`shelf-${index}`,[1.47,.055,.55],'shelf-ivory',[0,y,0],.012)
  for(let row=0;row<3;row++) {
    let x=-.61
    const base=[.148,.708,1.268][row]
    for(let i=0;i<(row===1?4:7);i++) {
      const w=.055+((i+row)%3)*.018,h=.29+((i*3+row)%5)*.035
      const book=new T.Group();book.name=`book-${row}-${i}`;book.position.set(x+w/2,base,0);model.add(book)
      bookBox(book,'page-block',[w-.009,h-.014,.25],'shelf-paper',[0,h/2,0],.003)
      for(const side of [-1,1])bookBox(book,`cover-${side}`,[.005,h,.27],i%3===0?'shelf-ink':i%3===1?'shelf-blue':'shelf-ivory',[side*w/2,h/2,0],.002)
      bookBox(book,'spine',[w,h,.014],i%3===0?'shelf-ink':'shelf-blue',[0,h/2,.133],.003)
      for(const y of [h*.18,h*.78])bookBox(book,`spine-rule-${y}`,[w*.65,.004,.002],'shelf-ivory',[0,y,.141],.001)
      x+=w+.018
    }
    if(row===1)for(let i=0;i<3;i++)rounded(model,`stacked-journal-${i}`,[.37,.042,.27],i===1?'shelf-blue':'shelf-paper',[.38,base+.023+i*.046,.01],.005)
  }
  model.userData.dimensions={width:1.47,height:1.8875,depth:.55}
  return model
}

function officeSofa() {
  const model=new T.Group();model.name='Three-seat-leather-office-sofa'
  for(const [name,color] of Object.entries({'sofa-leather':'#f0ecdf','sofa-piping':'#c4ced7','sofa-metal':'#5474a6','sofa-shadow':'#a9bbce'})) {
    palette[name]=new T.MeshStandardMaterial({name,color,roughness:name==='sofa-leather'?.48:.65,metalness:name==='sofa-metal'?.35:0})
  }
  const cushion=(name,size,position,radius=.09)=>{
    const part=rounded(model,name,size,'sofa-leather',position,radius)
    part.userData.contour=false;return part
  }
  const piping=(parent,name,w,d,y,z=0)=>{
    const r=.075,points=[]
    for(const [cx,cz,start] of [[w/2-r,d/2-r,0],[-w/2+r,d/2-r,Math.PI/2],[-w/2+r,-d/2+r,Math.PI],[w/2-r,-d/2+r,Math.PI*1.5]]) {
      for(let i=0;i<5;i++){const a=start+i/4*Math.PI/2;points.push(new T.Vector3(cx+Math.cos(a)*r,y,z+cz+Math.sin(a)*r))}
    }
    // Ordered rounded perimeter, closed into a continuous upholstery welt.
    const curve=new T.CatmullRomCurve3(points,true,'centripetal')
    mesh(parent,name,new T.TubeGeometry(curve,64,.0045,6,true),'sofa-piping')
  }
  for(const x of [-2.095,2.095])for(const z of [-.47,.47]) {
    rod(model,`slender-leg-${x}-${z}`,[[x,.34,z],[x*1.035,.055,z*1.1]],.027,'sofa-metal',1)
    cylinder(model,`floor-glide-${x}-${z}`,.039,.039,.025,'sofa-shadow',[x*1.035,.018,z*1.1])
  }
  rounded(model,'recessed-metal-plinth',[4.45,.085,1.08],'sofa-metal',[0,.32,0],.018)
  cushion('upholstered-base',[4.77,.27,1.28],[0,.48,0],.075)
  cushion('continuous-back-shell',[4.77,.94,.23],[0,1.12,-.53],.08)
  for(const side of [-1,1]) {
    cushion(`padded-arm-${side}`,[.25,.72,1.25],[side*2.265,.88,0],.08)
    rod(model,`arm-stitch-${side}`,[[side*2.265,1.235,-.48],[side*2.265,1.24,.05],[side*2.265,1.235,.48]],.004,'sofa-piping',20)
  }
  for(const [seat,x] of [[0,-1.47],[1,0],[2,1.47]]) {
    cushion(`seat-cushion-${seat}`,[1.43,.23,1.03],[x,.725,.075],.08)
    const welt=new T.Group();welt.position.x=x;model.add(welt)
    piping(welt,`seat-piping-${seat}`,1.39,.99,.77,.075)
    const back=cushion(`back-cushion-${seat}`,[1.43,.77,.23],[x,1.18,-.355],.08)
    back.rotation.x=-.10
    const seam=new T.Group();seam.position.copy(back.position);seam.rotation.copy(back.rotation);seam.rotation.x+=Math.PI/2;model.add(seam)
    piping(seam,`back-piping-${seat}`,1.39,.73,-.116)
    for(const offset of [-.27,.27]) {
      const button=cylinder(model,`leather-covered-button-${seat}-${offset}`,.021,.021,.008,'sofa-piping',[x+offset,1.22,-.227]);button.rotation.x=Math.PI/2
    }
  }
  model.userData.dimensions={width:4.78,height:1.59,depth:1.28}
  model.userData.orientation='Floor at Y=0, front faces +Z.'
  return model
}

function pencilHolder() {
  const model = new T.Group(); model.name = 'Atelier-tool-cup'
  for(const [name,color] of Object.entries({'tool-ivory':'#f0ecdf','tool-silver':'#b9c7d4','tool-ink':'#526b91','tool-paper':'#e1e5e5'})) {
    palette[name]=new T.MeshStandardMaterial({name,color,roughness:.7})
  }
  const profile=[[0,0],[.13,0],[.145,.025],[.16,.30],[.157,.318],[.142,.318],[.14,.30],[.127,.035],[0,.035]]
  mesh(model,'hollow-ceramic-cup',new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),40),'tool-ivory')
  const rim=mesh(model,'rolled-rim',new T.TorusGeometry(.15,.008,8,40),'tool-silver',[0,.313,0]);rim.rotation.x=Math.PI/2
  for(let i=0;i<20;i++) {
    const a=i*Math.PI/10
    rod(model,`ceramic-flute-${i}`,[[Math.cos(a)*.142,.055,Math.sin(a)*.142],[Math.cos(a)*.157,.288,Math.sin(a)*.157]],.002,'tool-paper',1)
  }
  for(const [i,x,z,height,lean] of [[0,-.07,-.025,.51,-.17],[1,.025,.055,.57,.13],[2,.075,.015,.48,.22],[3,-.015,-.065,.61,-.08]]) {
    const pencil=new T.Group();pencil.name=`drawing-pencil-${i}`;pencil.position.set(x,.035,z);pencil.rotation.z=lean;model.add(pencil)
    mesh(pencil,'hexagonal-barrel',new T.CylinderGeometry(.012,.012,height,6),'tool-ivory',[0,height/2,0])
    mesh(pencil,'sharpened-wood',new T.ConeGeometry(.012,.042,6),'tool-paper',[0,height+.021,0])
    mesh(pencil,'graphite-point',new T.ConeGeometry(.0037,.015,6),'tool-ink',[0,height+.046,0])
    cylinder(pencil,'end-band',.013,.013,.018,'tool-silver',[0,.022,0])
  }
  const scissors=new T.Group();scissors.name='studio-scissors';scissors.position.set(-.045,.035,.015);scissors.rotation.set(.08,.35,.16);model.add(scissors)
  // Two closed finger loops and two blades meet at a visible pivot.
  for(const side of [-1,1]) {
    const handle=mesh(scissors,`finger-loop-${side}`,new T.TorusGeometry(.047,.011,8,28),'tool-ink',[side*.048,.57,0])
    handle.scale.y=1.3
    rod(scissors,`handle-neck-${side}`,[[side*.036,.515,0],[side*.02,.46,0],[0,.405,side*.003]],.009,'tool-silver',8)
    const blade=new T.Shape();blade.moveTo(0,.408);blade.lineTo(side*.024,.34);blade.lineTo(side*.033,.10);blade.lineTo(side*.004,.14);blade.closePath()
    mesh(scissors,`steel-blade-${side}`,new T.ExtrudeGeometry(blade,{depth:.005,bevelEnabled:false}),'tool-silver',[0,0,side*.004])
  }
  const pivot=cylinder(scissors,'scissor-pivot',.014,.014,.018,'tool-ivory',[0,.405,0]);pivot.rotation.x=Math.PI/2
  const knife=new T.Group();knife.name='retractable-craft-knife';knife.position.set(.06,.045,-.055);knife.rotation.set(-.12,-.4,-.17);model.add(knife)
  rounded(knife,'knife-body',[.055,.47,.027],'tool-paper',[0,.235,0],.012)
  rounded(knife,'blade-channel',[.018,.32,.004],'tool-silver',[0,.31,-.015],.002)
  rounded(knife,'thumb-slider',[.031,.055,.014],'tool-ink',[0,.335,-.022],.004)
  rounded(knife,'end-cap',[.056,.035,.03],'tool-ink',[0,.02,0],.006)
  for(let i=0;i<7;i++)rounded(knife,`grip-ridge-${i}`,[.041,.004,.003],'tool-silver',[0,.08+i*.022,-.015],.001)
  return model
}

function windowModel() {
  const model = new T.Group(); model.name = 'Atelier-curtain-wall'
  const height = atelierLayout.ceiling - atelierLayout.floor
  palette.aluminium = new T.MeshStandardMaterial({name:'aluminium',color:'#4266b5',metalness:.18,roughness:.5})
  palette.gasket = new T.MeshStandardMaterial({name:'gasket',color:'#6a82ad',roughness:.85})
  palette.glass = new T.MeshPhysicalMaterial({name:'glass',color:'#d7edf1',transparent:true,opacity:.12,roughness:.08,metalness:0,ior:1.5,clearcoat:1,depthWrite:false})
  // Local X is the depth, Z runs along the facade. Units match the room shell.
  for(const z of [-6.5,-3.9,-1.3,1.3,3.9,6.5]) {
    rounded(model,`mullion-${z}`,[.16,height,.065],'aluminium',[0,height/2,z],.012)
    rounded(model,`interior-cap-${z}`,[.028,height,.09],'aluminium',[-.095,height/2,z],.008)
  }
  for(const y of [.045,2.51,height-.045]) {
    rounded(model,`transom-${y}`,[.15,.07,13.06],'aluminium',[0,y,0],.009)
  }
  for(let bay=0;bay<5;bay++) {
    const z=-5.2+bay*2.6
    for(const [level,bottom,top] of [['lower',.08,2.475],['upper',2.545,height-.08]]) {
      const h=top-bottom,mid=(top+bottom)/2
      // Recessed seals and spacer bars reveal the thickness at grazing angles.
      for(const edge of [-1,1]) mesh(model,`seal-${bay}-${level}-${edge}`,new T.BoxGeometry(.025,h,.016),'gasket',[-.065,mid,z+edge*1.258])
      for(const y of [bottom,top]) mesh(model,`spacer-${bay}-${level}-${y}`,new T.BoxGeometry(.025,.016,2.53),'gasket',[0,y,z])
      const pane=mesh(model,`glazing-${bay}-${level}`,new T.BoxGeometry(.024,h,2.51),'glass',[0,mid,z])
      pane.userData.glazing=true; pane.castShadow=false; pane.receiveShadow=false
    }
  }
  rounded(model,'interior-sill',[.26,.055,13.12],'aluminium',[-.045,.025,0],.012)
  return model
}

const requested = process.argv.slice(2)
for (const [name, build] of [['desk',desk],['chair',chair],['lamp',lamp],['cabinet',cabinet],['plant',plant],['window',windowModel],['pencil-holder',pencilHolder],['architect',seatedArchitect],['sofa',officeSofa],['small-bookcase',smallBookcase],['door',officeDoor]].filter(([name])=>!requested.length||requested.includes(name))) {
  const model=build();model.updateMatrixWorld(true)
  const binary=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true})
  const output = new URL(`../../../public${modelPaths[name]}`, import.meta.url)
  await mkdir(new URL('.', output), { recursive: true })
  await writeFile(output, Buffer.from(binary))
  let triangles=0;model.traverse(node=>{if(node.isMesh) triangles+=(node.geometry.index?.count??node.geometry.attributes.position.count)/3})
  console.log(`${name}: ${(binary.byteLength/1024).toFixed(0)} KB, ${triangles} triangles`)
}
