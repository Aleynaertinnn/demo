import { mkdir, writeFile } from 'node:fs/promises'
import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

// GLTFExporter uses the browser FileReader API; these assets have no external textures.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.() }) }
}
const palette = Object.fromEntries(Object.entries({
  oak: '#d6b78a', edge: '#a47750', frame: '#744333', metal: '#653b30',
  fabric: '#e7d5b3', seam: '#b39570', red: '#a34d35', inside: '#f2dfb7', rubber: '#4d382e',
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
  const model = new T.Group(); model.name = 'Drafting-desk'
  rounded(model, 'rounded-oak-top', [5, .14, 3], 'oak', [0, 0, 0], .035)
  rounded(model, 'laminated-edge', [4.96, .012, 2.96], 'edge', [0, -.048, 0], .006)
  for (const x of [-2.1, 2.1]) {
    for (const side of [-1, 1]) {
      rod(model, `splayed-leg-${x}-${side}`, [[x, -.08, side * .9], [x, -.7, side * 1.03], [x, -1.34, side * 1.21]], .045, 'frame')
      rounded(model, `foot-${x}-${side}`, [.13, .045, .18], 'rubber', [x, -1.365, side * 1.21], .015)
      joint(model, `top-fastener-${x}-${side}`, [x, -.13, side * .91], .035)
    }
    rounded(model, `trestle-${x}`, [.095, .075, 2.4], 'frame', [x, -.92, 0], .018)
    rounded(model, `top-rail-${x}`, [.11, .07, 2.3], 'edge', [x, -.11, 0], .015)
  }
  rod(model, 'long-stretcher', [[-2.1, -1, .72], [0, -1, .72], [2.1, -1, .72]], .027, 'frame')
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

const output = new URL('../public/models/', import.meta.url)
await mkdir(output,{recursive:true})
for (const [name, build] of [['desk',desk],['chair',chair],['lamp',lamp]]) {
  const model=build();model.updateMatrixWorld(true)
  const binary=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true})
  await writeFile(new URL(`${name}.glb`,output),Buffer.from(binary))
  let triangles=0;model.traverse(node=>{if(node.isMesh) triangles+=(node.geometry.index?.count??node.geometry.attributes.position.count)/3})
  console.log(`${name}: ${(binary.byteLength/1024).toFixed(0)} KB, ${triangles} triangles`)
}
