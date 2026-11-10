import { MathUtils, Vector3 } from 'three'
import { exteriorState } from './exterior-cycle.mjs'
import { journeyTime } from './day-cycle.mjs'
import { interiorBase } from '../geometry/interior.mjs'
import { finalePaper } from '../config/layout.mjs'
import { sketchStart } from '../config/journey.mjs'

export const atelierViews = [
  { camera: [-.8, 2.3, -6.2], target: [.1, .65, 0] },
  { camera: [-1.15, 2.85, -4.1], target: [-.46, .19, -.16] },
  { camera: [-.68, 2.65, -1.75], target: [-.56, .22, -.28] },
  { camera: [.16, 2.65, .5], target: [.15, .21, .01] },
]

export function atelierPose(progress) {
  const approach = progress / sketchStart
  const index = progress >= sketchStart ? 2 : approach < .5 ? 0 : 1
  const sketch = MathUtils.clamp((progress - sketchStart) / (1 - sketchStart), 0, 1)
  const amount = MathUtils.smoothstep(index === 2 ? sketch : approach * 2 - index, 0, 1)
  const start = cameraPose(atelierViews[index])
  const end = cameraPose(atelierViews[index + 1])
  return {
    ...Object.fromEntries(Object.keys(start).map(key => [key, MathUtils.lerp(start[key], end[key], amount)])),
    build: 0,
    open: 0,
    design: 0,
    day: 0,
    exterior: 0,
    sketch: MathUtils.smoothstep(sketch, .18, .96),
  }
}

export function cameraPose({ camera, target }) {
  return { x: camera[0], y: camera[1], z: camera[2], tx: target[0], ty: target[1], tz: target[2] }
}

export function constructionPose(progress) {
  const plan = cameraPose(atelierViews[3])
  const model = cameraPose({ camera: [2.1, 3.98, 2.25], target: [.15, 1.18, .01] })
  const amount = MathUtils.smoothstep(progress, 0, 1)
  return {
    ...Object.fromEntries(Object.keys(plan).map(key => [key, MathUtils.lerp(plan[key], model[key], amount)])),
    build: progress,
    open: 0,
    design: 0,
    day: 0,
    exterior: 0,
    sketch: 1,
  }
}

export function interiorPose(progress) {
  const wide=cameraPose({camera:[2.65,3.7,2.75],target:[.05,1.8,.01]})
  const start=progress<.38 ? constructionPose(1) : wide
  const end=progress<.38 ? wide : cameraPose({camera:[1.1,3.1,1.5],target:[.15,1.14,.01]})
  const amount=progress<.38 ? MathUtils.smoothstep(progress,0,.38) : MathUtils.smoothstep(progress,.38,1)
  return {
    ...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(start[key],end[key],amount)])),
    build:1,sketch:1,open:progress,design:0,day:0,exterior:0,
  }
}

export function designPose(value) {
  const views=[interiorPose(1),cameraPose({camera:[.5,3.05,1.65],target:[.15,1.14,.01]}),cameraPose({camera:[-.35,3.1,1.55],target:[.15,1.14,.01]})]
  const index=Math.min(1,Math.floor(value)),amount=MathUtils.smoothstep(value-index,0,1)
  return {
    ...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),
    build:1,sketch:1,open:1,design:value,day:0,exterior:0,
  }
}

export function dayPose(progress) {
  const localPose=(camera,target)=>cameraPose({
    camera:new Vector3(...camera).applyAxisAngle(new Vector3(0,1,0),.16).toArray(),
    target:new Vector3(...target).applyAxisAngle(new Vector3(0,1,0),.16).toArray(),
  })
  const eye=interiorBase+.18
  const views=[designPose(2),
    localPose([.52,interiorBase+.42,-.12],[.73,interiorBase+.095,.035]),
    localPose([.47,eye,-.10],[.73,interiorBase+.095,.035]),
    localPose([.20,eye,.05],[-.16,interiorBase+.15,.05]),
    localPose([-.15,eye,.05],[-.16,interiorBase+.15,.26]),
    localPose([-.15,eye,.26],[-.45,interiorBase+.11,.30]),
    localPose([-.25,eye,.34],[-.46,interiorBase+.12,.24]),
    localPose([-.28,interiorBase+.17,.33],[-.4,interiorBase+.145,.72])]
  const knots=[0,.20,.34,.48,.58,.72,.86,1]
  let index=0
  while(index<knots.length-2 && progress>knots[index+1])index++
  const amount=MathUtils.smoothstep(progress,knots[index],knots[index+1])
  return {...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),build:1,sketch:1,open:1,design:2,day:journeyTime(progress),exterior:0}
}

export function exteriorPose(progress) {
  if(progress>=.55) {
    const orbit=MathUtils.smoothstep(progress,.55,1)
    const angle=Math.atan2(2,2.29)+orbit*Math.PI*2
    const radius=Math.hypot(2,2.29)
    return {...cameraPose({camera:[.15+Math.sin(angle)*radius,3.98-.45*Math.sin(orbit*Math.PI)**2,.01+Math.cos(angle)*radius],target:[.15,1.18,.01]}),build:1,sketch:1,open:0,design:2,day:1,exterior:progress}
  }
  const initial=dayPose(1)
  const localPose=(camera,target)=>cameraPose({
    camera:new Vector3(...camera).applyAxisAngle(new Vector3(0,1,0),.16).toArray(),
    target:new Vector3(...target).applyAxisAngle(new Vector3(0,1,0),.16).toArray(),
  })
  const views=[initial,
    localPose([-.3656,interiorBase+.17,.92],[-.44,interiorBase+.14,.58]),
    localPose([-.95,1.6,1.3],[-.3656,interiorBase+.145,.63]),
    cameraPose({camera:[2.15,3.98,2.3],target:[.15,1.18,.01]})]
  const knots=[0,.18,.38,.55]
  let index=0
  while(index<knots.length-2 && progress>knots[index+1])index++
  const amount=MathUtils.smoothstep(progress,knots[index],knots[index+1])
  return {...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),build:1,sketch:1,open:1-exteriorState(progress).close,design:2,day:1,exterior:progress}
}

export function finalePose(progress) {
  const views=[exteriorPose(1),exteriorPose(1),cameraPose(atelierViews[0]),
    cameraPose({camera:[finalePaper[0],1.8,finalePaper[2]-.38],target:finalePaper})]
  const knots=[0,.12,.48,.8]
  let index=0
  while(index<knots.length-2 && progress>knots[index+1])index++
  const amount=MathUtils.smoothstep(progress,knots[index],knots[index+1])
  return {...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),build:1,sketch:1,open:0,design:2,day:1,exterior:1,finale:progress}
}
