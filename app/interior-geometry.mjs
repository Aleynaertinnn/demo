import { BoxGeometry, CylinderGeometry, DodecahedronGeometry, CatmullRomCurve3, TubeGeometry, Vector3, Matrix4 } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { grid, cells, footprints, projectLines, floorHeight, modelBase } from './project-plan.mjs'

export const interiorLevel = 3
export const interiorBase = modelBase + interiorLevel * floorHeight
export const splitHeight = interiorBase + floorHeight
export function openingState(progress) {
  const smooth = (a,b) => { const t=Math.max(0,Math.min(1,(progress-a)/(b-a)));return t*t*(3-2*t) }
  return { lift: smooth(0,.65)*1.65, slide: smooth(.1,.8)*-.65, cut: floorHeight-smooth(.32,.85)*.22 }
}
// Layouts move complete furniture groups, including cushions, legs and accessories.
export const interiorLayouts = [
  { living: [-.48,-.43,0], dining:[.4,-.26,0], work:[-.45,.42,0], bedroom:[.77,.46,0] },
  { living: [-.48,-.43,0], dining:[.74,.04,0], work:[-.45,.42,-Math.PI/2], bedroom:[.77,.46,Math.PI] },
  { living: [-.48,.21,0], dining:[.73,.035,Math.PI/2], work:[-.45,-.22,0], bedroom:[.77,.46,Math.PI/2] },
]
export function createInterior(style = 0, scope = 'all') {
  let structural = true
  const batches={}
  let placement = null
  function placed(origin, destination, draw) {
    const previous=placement
    const local=new Matrix4().makeTranslation(destination[0],0,destination[1])
      .multiply(new Matrix4().makeRotationY(destination[2]))
      .multiply(new Matrix4().makeTranslation(-origin[0],0,-origin[1]))
    placement=previous ? previous.clone().multiply(local) : local
    draw()
    placement=previous
  }
  const add=(kind,g)=>{if(placement)g.applyMatrix4(placement);if((scope==='structure' && !structural)||(scope==='furniture' && structural)){g.dispose();return}const flat=g.index?g.toNonIndexed():g.clone();g.dispose();(batches[kind]||=[]).push(flat)}
  function box(kind,x,y,z,w,h,d,r=0) {
    const g=r?new RoundedBoxGeometry(w,h,d,2,r):new BoxGeometry(w,h,d)
    g.translate(x,y,z);add(kind,g)
  }
  function cylinder(kind,x,y,z,r,h) {const g=new CylinderGeometry(r,r,h,16);g.translate(x,y,z);add(kind,g)}
  // The floor follows the actual fourth-storey footprint, including its terrace setback.
  for(const [x,z] of cells){
    if(!footprints[interiorLevel].has(`${x}:${z}`))continue
    for(let i=0;i<5;i++)box('floor',grid.x+(x+(i+.5)/5)*grid.width,.019,grid.z+(z+.5)*grid.depth,grid.width/5-.001,.002,grid.depth-.001)
  }
  // All interior doorways inherit their endpoints from the drawing.
  for(const [[x,z],[endX,endZ]] of projectLines.slice(4)){
    const g=new BoxGeometry(Math.hypot(endX-x,endZ-z),.12,.01)
    g.rotateY(-Math.atan2(endZ-z,endX-x));g.translate((x+endX)/2,.08,(z+endZ)/2);add('wall',g)
  }
  // The staircase remains whole while the exterior is cut away.
  for(let step=0;step<9;step++) {
    box('wall',-.06,.018+step*.014,-.23+step*.025,.17,.014,.025)
    if(step%2===0)for(const x of [-.15,.03])box('metal',x,.054+step*.014,-.23+step*.025,.003,.06,.003)
  }
  for(const x of [-.15,.03]) {
    const rail=new TubeGeometry(new CatmullRomCurve3([new Vector3(x,.09,-.23),new Vector3(x,.202,-.03)]),12,.003,6,false)
    add('metal',rail)
  }
  box('wall',-.06,.144,.012,.17,.014,.06)
  structural = false
  placed([-.48,-.43],interiorLayouts[style].living,()=>{
  // Living room: upholstered sofa, individual cushions, rug and two nesting tables.
  if(style===1) {
    const rug=new CylinderGeometry(.19,.19,.003,40);rug.scale(1,1,.8);rug.translate(-.44,.022,-.22);add('rug',rug)
  } else box('rug',-.44,.022,-.22,.37,.003,.31)
  if(style===2) {
    cylinder('metal',-.27,.027,-.07,.027,.012)
    cylinder('metal',-.27,.106,-.07,.003,.15)
    cylinder('lamp',-.27,.19,-.07,.035,.028)
    box('fabric',-.57,.052,-.34,.095,.06,.18,.002)
    box('cushion',-.57,.087,-.34,.08,.015,.16,.002)
  }

  if(style===1) {
    placed([-.48,-.43],[-.575,-.30,Math.PI/2],()=>{
  box('fabric',-.48,.052,-.43,.3,.065,.13,style===2?.002:.015)
  box('fabric',-.48,.094,-.485,.31,.065,.025,.01)
  for(const x of [-.62,-.34])box('fabric',x,.075,-.43,.024,.06,.14,.008)
  for(const x of [-.57,-.48,-.39]){box('cushion',x,.088,-.425,.083,.024,.09,.009);box('cushion',x,.116,-.468,.066,.035,.015,.006)}
    })
    cylinder('wood',-.32,.047,-.46,.045,.05)
    cylinder('cushion',-.32,.08,-.46,.047,.018)
  } else {
  box('fabric',-.48,.052,-.43,.3,.065,.13,style===2?.002:.015)
  box('fabric',-.48,.094,-.485,.31,.065,.025,.01)
  for(const x of [-.62,-.34])box('fabric',x,.075,-.43,.024,.06,.14,.008)
  for(const x of [-.57,-.48,-.39]){box('cushion',x,.088,-.425,.083,.024,.09,.009);box('cushion',x,.116,-.468,.066,.035,.015,.006)}
  }
  if(style===2) {
    box('metal',-.44,.05,-.21,.16,.009,.1)
    for(const x of [-.5,-.38])box('metal',x,.036,-.21,.006,.022,.08)
  } else {
    cylinder('wood',style===1?-.37:-.46,.054,style===1?-.28:-.23,style===1?.075:.067,.012);cylinder('metal',style===1?-.37:-.46,.038,style===1?-.28:-.23,style===1?.036:.009,.027)
    if(style===0){cylinder('wood',-.35,.043,-.16,.045,.009);cylinder('metal',-.35,.033,-.16,.007,.018)}
  }
  box('blue',style===1?-.37:-.47,.064,style===1?-.28:-.23,.04,.006,.027)
  placed([-.64,-.12],style===1?[-.44,-.565,Math.PI/2]:[-.64,-.12,0],()=>{
  box('wood',-.64,.07,-.12,.025,.1,.19)
  for(let i=0;i<7;i++)box(i%2?'blue':'cushion',-.62,.06+(i%3)*.015,-.19+i*.022,.018,.045,.014)
  })
  })
  placed([.4,-.26],interiorLayouts[style].dining,()=>{
  // Dining table with four separate chairs and place settings.
  if(style===1) {
    cylinder('wood',.4,.085,-.26,.11,.015)
    cylinder('wood',.4,.05,-.26,.035,.066)
  } else {
    box('wood',.4,.085,-.26,style===2?.24:.22,.015,.18,style===2?.002:.009)
    for(const x of [.31,.49])for(const z of [-.33,-.19])box('metal',x,.05,z,style===2?.004:.009,.066,.009)
  }
  for(const [x,z] of [[.25,-.26],[.52,-.26],[.4,-.39],[.4,-.13]]){
    box('fabric',x,.059,z,.065,.016,.065,.008)
    box('wood',x,.093,z-.03,.065,.06,.008)
    for(const dx of [-.023,.023])for(const dz of [-.023,.023])box('metal',x+dx,.036,z+dz,.005,.04,.005)
  }
  for(const x of [.35,.45])for(const z of [-.3,-.22])cylinder('wall',x,.096,z,.018,.003)
  })
  // Fitted kitchen, sink, cooking rings, cabinet seams and handles.
  box('cabinet',.36,.06,-.55,.36,.08,.09)
  box('wall',.36,.105,-.55,.37,.01,.095)
  for(let i=0;i<5;i++){box('metal',.2+i*.07,.06,-.502,.001,.065,.001);box('metal',.225+i*.07,.087,-.497,.017,.003,.003)}
  box('metal',.27,.111,-.55,.065,.002,.045);box('wall',.27,.113,-.55,.05,.002,.03)
  for(const x of [.42,.46])for(const z of [-.57,-.535])cylinder('metal',x,.112,z,.013,.002)
  box('cabinet',.2,.17,-.565,.08,.07,.06)
  placed([.77,.46],interiorLayouts[style].bedroom,()=>{
  // Bedroom: bed frame, mattress, folded duvet, pillows and bedside cabinet.
  box('wood',.77,.045,.46,.22,.045,.25)
  box('cushion',.77,.075,.46,.21,.035,.255,.012)
  box('fabric',.77,.097,.45,.215,.015,.16,.006)
  box('wood',.77,.11,.585,.23,style===1?.13:.1,.018,style===1?.008:.002)
  for(const x of [.72,.82])box('wall',x,.101,.55,.075,.02,.055,.008)
  const bedside=style===0?[.925,.55]:style===1?[.64,.38]:[.75,.63]
  box('cabinet',bedside[0],.062,bedside[1],.055,.085,.06)
  cylinder('metal',bedside[0],.12,bedside[1],.006,.035);cylinder('lamp',bedside[0],.14,bedside[1],.022,.016)
  })
  placed([.4,-.26],interiorLayouts[style].dining,()=>{
  // Pendant fixtures change silhouette as well as material.
  if(style===1) {
    const shade=new DodecahedronGeometry(.047,1);shade.scale(1,.65,1);shade.translate(.4,.215,-.26);add('lamp',shade)
  } else if(style===2) {
    box('lamp',.4,.218,-.26,.19,.009,.018)
    for(const x of [.33,.47])box('metal',x,.25,-.26,.002,.06,.002)
  } else {
    cylinder('lamp',.4,.215,-.26,.038,.025)
    cylinder('metal',.4,.247,-.26,.002,.04)
  }
  })
  // Bathroom with shower tray, screen, basin and toilet.
  box('tile',.35,.023,.46,.35,.003,.3)
  for(let i=0;i<5;i++){box('metal',.2+i*.07,.025,.46,.001,.001,.3);box('metal',.35,.025,.32+i*.065,.35,.001,.001)}
  box('wall',.25,.03,.54,.13,.014,.13)
  box('glass',.315,.085,.54,.003,.11,.13)
  box('cabinet',.45,.063,.57,.1,.075,.06)
  cylinder('wall',.45,.106,.57,.028,.012)
  box('wall',.46,.05,.37,.055,.04,.085,.012)
  placed([-.45,.42],interiorLayouts[style].work,()=>{
  // Reading/work corner, shelving and a miniature indoor plant.
  box('wood',-.45,.09,.42,.32,.012,.12)
  for(const x of [-.59,-.31])box('metal',x,.055,.42,.009,.06,.08)
  box('blue',-.44,.1,.42,.07,.006,.05)
  box('fabric',-.45,.06,.29,.08,.025,.08,.01)
  box('cabinet',-.63,.09,.3,.035,.14,.27)
  for(let i=0;i<9;i++)box(i%3?'cushion':'blue',-.604,.075,.19+i*.026,.015,.07,.018)
  const plantPosition=style===1?[-.30,.27]:[-.24,.52]
  cylinder('wood',plantPosition[0],.045,plantPosition[1],.027,.04)
  const plant=new DodecahedronGeometry(.043,0);plant.translate(plantPosition[0],.095,plantPosition[1]);add('green',plant)
  })
  return Object.fromEntries(Object.entries(batches).map(([kind,pieces])=>{
    const geometry=mergeGeometries(pieces,false);pieces.forEach(g=>g.dispose());return [kind,geometry]
  }))
}
