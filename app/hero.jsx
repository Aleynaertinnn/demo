'use client'

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { BoxGeometry, EdgesGeometry, MathUtils, Vector3, Shape, ShapeGeometry, BufferGeometry, DoubleSide, NoToneMapping, PCFShadowMap } from 'three'
import { IllustrationPalette, IllustrationMaterial } from './illustration'
import { exteriorState } from './exterior-cycle.mjs'
import DaylightScene from './daylight-scene'
import { dayState } from './day-cycle.mjs'
import { interiorBase } from './interior-geometry.mjs'
import { interiorDesigns, designAtProgress } from './interior-designs.mjs'
import ArchitectureModel from './architecture-model'
import AtelierFurniture from './atelier-furniture'
import DraftingSheets, { ProjectSketch } from './drafting-sheets'

const stops = [
  { id: 'plan', number: '01', title: 'Plan', point: [-.88, .23, .68],
    camera: [.15, 4.55, 1.45], target: [.15, .18, 0],
    description: 'Kareli eskiz üzerinden yapının zemin oturumunu ve dolaşımını incele.' },
  { id: 'model', number: '02', title: 'Maket', point: [.15, 2.25, -.09],
    camera: [2.5, 3.15, 2.7], target: [.15, 1.06, .01],
    description: 'Geri çekilen katlar, yapının kütlesini küçültür ve teraslara yer açar.' },
  { id: 'materials', number: '03', title: 'Malzemeler', point: [1.65, .28, .82],
    camera: [2.7, 3.3, 2.75], target: [.3, 1.05, .1],
    description: 'Bir yüzey seç ve maketin ana cephesinin rengini karşılaştır.' },
]

const materials = [
  { name: 'Kireç taşı', color: '#faf8ed' },
  { name: 'Mavi karton', color: '#b7c8df' },
  { name: 'Beton', color: '#d4dde4' },
]

const overview = { camera: [2.65, 3.5, 2.75], target: [0, .95, -.25] }
const sketchStart = .6
const exteriorStart = .85
const lifeStart = .82 * exteriorStart
const designStart = .78 * lifeStart
const interiorStart = .72 * designStart
const modelStart = .62 * interiorStart

const atelierViews = [
  { camera: [-.8, 1.9, -4.6], target: [.1, .65, .35] },
  { camera: [-1.62, 2.07, -3.62], target: [-.46, .19, -.16] },
  { camera: [-.68, 2.65, -1.75], target: [-.56, .22, -.28] },
  { camera: [.16, 2.65, .5], target: [.15, .21, .01] },
]

function atelierPose(progress) {
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

function cameraPose({ camera, target }) {
  return { x: camera[0], y: camera[1], z: camera[2], tx: target[0], ty: target[1], tz: target[2] }
}

const [planStop, modelStop, materialsStop] = stops

function constructionPose(progress) {
  const plan = cameraPose(atelierViews[3])
  const model = cameraPose({ camera: [2.5, 3.15, 2.7], target: [.15, 1.06, .01] })
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

function interiorPose(progress) {
  const wide=cameraPose({camera:[2.65,3.7,2.75],target:[.05,1.8,.01]})
  const start=progress<.38 ? constructionPose(1) : wide
  const end=progress<.38 ? wide : cameraPose({camera:[1.25,2.95,1.7],target:[.15,1.14,.01]})
  const amount=progress<.38 ? MathUtils.smoothstep(progress,0,.38) : MathUtils.smoothstep(progress,.38,1)
  return {
    ...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(start[key],end[key],amount)])),
    build:1,sketch:1,open:progress,design:0,day:0,exterior:0,
  }
}

function designPose(value) {
  const views=[interiorPose(1),cameraPose({camera:[.55,2.8,1.85],target:[.15,1.14,.01]}),cameraPose({camera:[-.4,2.95,1.75],target:[.15,1.14,.01]})]
  const index=Math.min(1,Math.floor(value)),amount=MathUtils.smoothstep(value-index,0,1)
  return {
    ...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),
    build:1,sketch:1,open:1,design:value,day:0,exterior:0,
  }
}

function dayPose(progress) {
  const close=cameraPose({camera:[0,1.65,1.05],target:[-.25,interiorBase+.10,.35]})
  const eye=new Vector3(-.28,interiorBase+.17,.33).applyAxisAngle(new Vector3(0,1,0),.16)
  const window=new Vector3(-.4,interiorBase+.145,.72).applyAxisAngle(new Vector3(0,1,0),.16)
  const start=progress<.55?designPose(2):close
  const end=progress<.55?close:cameraPose({camera:eye.toArray(),target:window.toArray()})
  const amount=progress<.55?MathUtils.smoothstep(progress,0,.55):MathUtils.smoothstep(progress,.55,1)
  return {...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(start[key],end[key],amount)])),build:1,sketch:1,open:1,design:2,day:progress,exterior:0}
}

function exteriorPose(progress) {
  const initial=dayPose(1)
  const localPose=(camera,target)=>cameraPose({
    camera:new Vector3(...camera).applyAxisAngle(new Vector3(0,1,0),.16).toArray(),
    target:new Vector3(...target).applyAxisAngle(new Vector3(0,1,0),.16).toArray(),
  })
  const views=[initial,
    localPose([-.3656,interiorBase+.17,.92],[-.50,interiorBase+.145,1.12]),
    localPose([-.95,1.6,1.3],[-.3656,interiorBase+.145,.63]),
    cameraPose({camera:[1.8,2.7,2.5],target:[.15,1.15,0]}),
    cameraPose({camera:[2.65,3.25,2.75],target:[.1,.8,0]})]
  const knots=[0,.18,.38,.75,1]
  let index=0
  while(index<3 && progress>knots[index+1])index++
  const amount=MathUtils.smoothstep(progress,knots[index],knots[index+1])
  return {...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),build:1,sketch:1,open:1-exteriorState(progress).close,design:2,day:1,exterior:progress}
}

const paper = '#eeecdf'
const white = '#faf8ed'

function Box({ position, size, color, rotation, outline = Math.min(...size) > .02, castShadow = false, contour = '#4b6792', paperSurface = false, inkStrength = .5 }) {
  const [width, height, depth] = size
  const edges = useMemo(() => {
    if (!outline) return null
    const geometry = new BoxGeometry(width, height, depth)
    const result = new EdgesGeometry(geometry)
    geometry.dispose()
    return result
  }, [outline, width, height, depth])

  useEffect(() => () => edges?.dispose(), [edges])

  return (
    <mesh position={position} rotation={rotation} castShadow={castShadow} receiveShadow>
      <boxGeometry args={size} />
      <IllustrationMaterial color={color} userData={{ inkStrength: paperSurface ? .12 : inkStrength }} />
      {edges && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={contour} transparent opacity={.48} depthWrite={false} />
        </lineSegments>
      )}
    </mesh>
  )
}

const leaves = [
  [-.34, .62, .14, -.66], [.32, .78, -.05, .65], [-.3, 1.16, .02, -.48],
  [.34, 1.37, .08, .56], [-.29, 1.66, -.12, -.55], [.23, 1.98, 0, .38],
  [.02, 2.15, -.07, -.12],
]

function PaperLeaf({ color }) {
  const { surface, edge, vein } = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(0, -.48)
    shape.bezierCurveTo(-.3, -.16, -.28, .24, 0, .58)
    shape.bezierCurveTo(.17, .28, .3, -.13, 0, -.48)
    const surface = new ShapeGeometry(shape, 10)
    const edge = new EdgesGeometry(surface)
    const vein = new BufferGeometry().setFromPoints([
      new Vector3(0, -.46, .003), new Vector3(-.025, .04, .003), new Vector3(0, .52, .003),
    ])
    return { surface, edge, vein }
  }, [])
  useEffect(() => () => { surface.dispose(); edge.dispose(); vein.dispose() }, [surface, edge, vein])
  return (
    <group>
      <mesh geometry={surface} castShadow>
        <IllustrationMaterial color={color} side={DoubleSide} />
      </mesh>
      <lineSegments geometry={edge}><lineBasicMaterial color="#3e5888" transparent opacity={.6} /></lineSegments>
      <line geometry={vein}><lineBasicMaterial color="#bbcad7" /></line>
    </group>
  )
}

function Plant() {
  return (
    <group position={[-3.14, -1.39, .38]}>
      <mesh position={[0, .34, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[.34, .23, .67, 32]} />
        <IllustrationMaterial color="#eeecdf" />
      </mesh>
      <mesh position={[0, .67, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.33, .014, 6, 32]} />
        <IllustrationMaterial color="#4966a0" />
      </mesh>
      <Box position={[0, 1.38, 0]} size={[.018, 1.51, .018]} color="#4966a0" />
      {leaves.map(([x, y, z, tilt], index) => (
        <group key={y} position={[x, y, z]} rotation={[.1 + index * .08, .23 * (index % 3), tilt]}>
          <PaperLeaf color={index % 2 ? '#9baeba' : '#7d94b2'} />
        </group>
      ))}
    </group>
  )
}

function DeskDetails() {
  return (
    <group>
      {/* Thin page blocks and offset covers replace solid book-like cubes. */}
      {[0, 1, 2].map(index => (
        <group key={index} position={[2.02 - index * .035, .14 + index * .095, .06]} rotation={[0, -.13 + index * .12, 0]}>
          <Box position={[0, .035, 0]} size={[.47, .065, .64]} color="#f9f6e9" outline />
          {[0, .072].map(y => <Box key={y} position={[0, y, 0]} size={[.49, .008, .67]} color={index === 1 ? '#3459c5' : '#d1dce7'} outline />)}
          {[.02, .04, .055].map(y => <Box key={y} position={[.236, y, 0]} size={[.001, .002, .6]} color="#acbfce" />)}
        </group>
      ))}
      <group position={[1.65, .16, .87]} rotation={[Math.PI / 2, 0, -.32]}>
        <mesh castShadow><cylinderGeometry args={[.018, .018, .67, 6]} /><IllustrationMaterial color="#2451c4" /></mesh>
        <mesh position={[0, .39, 0]}><coneGeometry args={[.018, .11, 6]} /><IllustrationMaterial color="#dedbc7" /></mesh>
        <mesh position={[0, .45, 0]}><coneGeometry args={[.006, .025, 6]} /><IllustrationMaterial color="#26436f" /></mesh>
      </group>

    </group>
  )
}

function Room() {
  return (
    <group>
      <Box position={[0, -1.46, 0]} size={[13, .12, 20]} color="#eee9d9" inkStrength={.38} />
      {Array.from({ length: 19 }, (_, index) => (
        <Box key={index} position={[-6 + index * .66, -1.397, 0]} size={[.012, .004, 18]} color="#c9ccca" />
      ))}
      <Box position={[0, 1.55, 3.2]} size={[22, 6, .16]} color="#f5f0de" inkStrength={.85} />
      <Box position={[-4.75, 1.58, -.38]} size={[.16, 6, 7.25]} color="#e2e8eb" />
      <Box position={[0, 4.15, -.24]} size={[12, .18, 8]} color="#e4e9eb" />
      <Box position={[0, -1.22, 3.08]} size={[12, .28, .08]} color="#a7bdd4" />
      <group position={[-1.3, 0, 0]} scale={[-1, 1, 1]}>
        <Box position={[-4.4, -.88, .4]} size={[.18, 1.04, 5.6]} color="#e6e8e1" castShadow />
        <Box position={[-4.4, 2.8, .4]} size={[.18, 1.3, 5.6]} color="#f5f0df" castShadow />
        <mesh position={[-7.4, .9, .8]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[12, 6]} />
          <meshBasicMaterial color="#cbdde8" />
        </mesh>
        <mesh position={[-7.32, .9, -1.05]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[.46, 48]} />
          <meshBasicMaterial color="#fff9dc" toneMapped={false} />
        </mesh>
        {[[-2.2, 1.4], [-.8, 2], [.65, 1.6], [2, 2.6], [3.15, 1.9]].map(([z, height]) => (
          <mesh key={z} position={[-7.1, -1.35 + height / 2, z]}>
            <boxGeometry args={[.12, height, 1.06]} />
            <meshBasicMaterial color="#98b1d0" />
          </mesh>
        ))}
        {[-2.4, -.55, 1.3, 3.2].map(z => (
          <Box key={z} position={[-4.37, .91, z]} size={[.15, 2.58, .1]} color="#3d61bd" castShadow outline />
        ))}
        <Box position={[-4.35, .76, .4]} size={[.16, .075, 5.6]} color="#3d61bd" castShadow />
        <Box position={[-4.32, -.33, .4]} size={[.35, .11, 5.7]} color="#f9f7ea" />
          <Box position={[-4.4, .91, -3.4]} size={[.18, 5.4, 2]} color="#e2e8eb" castShadow />
      </group>
      {[[-2.35, 1.3, .11], [-.94, 1.47, -.12], [.53, 1.16, .07], [-.64, .43, .09]].map(([x, y, angle], index) => (
        <group key={index} position={[x, y, 3.09]} rotation={[0, 0, angle]}>
          <Box position={[0, 0, 0]} size={[1.23, .9, .025]} color="#fffcf0" outline />
          <Box position={[0, .32, -.028]} size={[.1, .045, .03]} color="#3b61bb" />
          {[-.25, .25].map(line => (
            <Box key={line} position={[line, -.03, -.025]} size={[.013, .45, .01]} color="#859bb6" />
          ))}
          {[-.25, .18].map(line => (
            <Box key={line} position={[0, line, -.025]} size={[.51, .013, .01]} color="#859bb6" />
          ))}
        </group>
      ))}
      <Plant />
      <Box position={[-3.08, -.75, 2.75]} size={[2.15, 1.3, .62]} color="#cad9e7" outline />
      {[-.4, .05, .55].map((offset, index) => (
        <Box key={offset} position={[-3.08 + offset, .04 + index * .1, 2.72]}
          size={[.5, .13, .32]} color={index === 1 ? '#f5f2e3' : '#5477bd'} rotation={[0, -.12, 0]} />
      ))}
    </group>
  )
}

function Desk({ motion, markers, finish }) {
  const projection = useRef(new Vector3())

  useFrame(({ camera, size }) => {
    const { x, y, z, tx, ty, tz, build } = motion.current
    // Widen the lens on tall screens; dollying backward would cross the room walls.
    const framing = MathUtils.clamp(1.15 / camera.aspect, 1, 2.1)
    const fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(47 / 2)) * framing))
    if (Math.abs(camera.fov - fov) > .01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    camera.position.set(x, y, z)
    camera.lookAt(tx, ty, tz)
    camera.updateMatrixWorld()

    stops.forEach(({ id, point }, index) => {
      const marker = markers.current[index]
      if (!marker) return
      projection.current.set(...point)
      if (id === 'model') projection.current.y = MathUtils.lerp(.28, point[1], build)
      projection.current.project(camera)
      const projected = projection.current
      const left = (projected.x + 1) * size.width / 2
      const top = (1 - projected.y) * size.height / 2
      marker.style.transform = `translate(${left}px, ${top}px) translate(-50%, -50%)`
      marker.style.visibility = Math.abs(projected.x) <= .94 && Math.abs(projected.y) <= .9
        ? 'visible' : 'hidden'
    })
  })

  return (
    <>
      <DaylightScene motion={motion} />
      <Room />
      <DeskDetails />
      <AtelierFurniture />
      <group rotation={[0, .16, 0]}>
        <Box position={[.12, .14, .13]} size={[3.42, .06, 2.12]} color={paper} paperSurface />
        <Box position={[.2, .18, .06]} size={[3.25, .025, 2]} color={white} paperSurface />
        <ProjectSketch motion={motion} />
        <ArchitectureModel motion={motion} finish={finish} />
      </group>
      {[-.92, -.78].map((z, index) => (
        <mesh key={z} position={[1.48, .206 + index * .025, z]} rotation={[0, .12, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[.075, .075, .85, 20]} />
          <IllustrationMaterial color={index ? '#dce5ec' : '#fffbee'} />
        </mesh>
      ))}
      <DraftingSheets />
    </>
  )
}

export default function Hero() {
  const viewport = useRef(null)
  const journey = useRef(null)
  const exploring = useRef(false)
  const motion = useRef(atelierPose(0))
  const markers = useRef([])
  const cameraTween = useRef(null)
  const [take, setTake] = useState(0)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(1)
  const [interiorProgress, setInteriorProgress] = useState(0)
  const [designIndex, setDesignIndex] = useState(0)
  const [dayProgress, setDayProgress] = useState(0)
  const [exteriorProgress, setExteriorProgress] = useState(0)
  const [active, setActive] = useState(null)
  const [finish, setFinish] = useState(materials[0])

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function updateJourney(event) {
      if (exploring.current) {
        if (event?.type !== 'scroll') return
        exploring.current = false
        cameraTween.current?.kill()
        setActive(null)
      }
      const track = journey.current
      const top = track.getBoundingClientRect().top
      const trackDistance = track.offsetHeight - viewport.current.parentElement.offsetHeight
      const remainingPage = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      const distance = Math.min(trackDistance, remainingPage - top)
      const progress = MathUtils.clamp(-top / Math.max(distance, 1), 0, 1)
      const timeline = preference.matches ? 1 : progress
      const build = MathUtils.clamp((timeline - modelStart) / (interiorStart - modelStart), 0, 1)
      const opening=MathUtils.clamp((timeline-interiorStart)/(designStart-interiorStart),0,1)
      const design=designAtProgress(MathUtils.clamp((timeline-designStart)/(lifeStart-designStart),0,1))
      const day=MathUtils.clamp((timeline-lifeStart)/(exteriorStart-lifeStart),0,1)
      const outside=MathUtils.clamp((timeline-exteriorStart)/(1-exteriorStart),0,1)
      Object.assign(motion.current, timeline < modelStart
        ? atelierPose(timeline / modelStart)
        : timeline < interiorStart ? constructionPose(build) : timeline < designStart ? interiorPose(opening) : timeline < lifeStart ? designPose(design) : timeline < exteriorStart ? dayPose(day) : exteriorPose(outside))
      setDesignIndex(Math.round(design))
      setDayProgress(Math.round(day*100))
      setExteriorProgress(Math.round(outside*100))
      setInteriorProgress(Math.round(opening*100))
      setProgress(Math.round(build * 100))
      setStage(timeline >= exteriorStart ? 7 : timeline >= lifeStart ? 6 : timeline >= designStart ? 5 : timeline >= interiorStart ? 4 : timeline >= modelStart ? 3 : timeline >= sketchStart * modelStart ? 2 : 1)
    }

    updateJourney()
    setReady(true)
    window.addEventListener('scroll', updateJourney, { passive: true })
    window.addEventListener('resize', updateJourney)
    preference.addEventListener('change', updateJourney)
    return () => {
      window.removeEventListener('scroll', updateJourney)
      window.removeEventListener('resize', updateJourney)
      preference.removeEventListener('change', updateJourney)
      cameraTween.current?.kill()
    }
  }, [take])

  function selectStop(stop) {
    exploring.current = true
    setStage(3)
    setDesignIndex(0)
    setInteriorProgress(0)
    motion.current.open = 0
    motion.current.design = 0
    motion.current.day = 0
    motion.current.exterior = 0
    setDayProgress(0)
    setExteriorProgress(0)
    motion.current.sketch = 1
    setActive(stop)
    cameraTween.current?.kill()
    const value = stop === planStop ? 0 : 1
    const pose = stop === planStop || stop === modelStop
      ? constructionPose(value)
      : { ...cameraPose(stop ?? overview), build: value, open: 0, design: 0, day: 0, exterior: 0 }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(motion.current, pose)
      setProgress(value * 100)
      return
    }
    cameraTween.current = gsap.to(motion.current, {
      ...pose, duration: .85, ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.round(motion.current.build * 100)),
    })
  }

  function scrub(event) {
    exploring.current = true
    setStage(3)
    setDesignIndex(0)
    setInteriorProgress(0)
    motion.current.open = 0
    motion.current.design = 0
    motion.current.day = 0
    motion.current.exterior = 0
    setDayProgress(0)
    setExteriorProgress(0)
    motion.current.sketch = 1
    const value = Number(event.target.value)
    cameraTween.current?.kill()
    Object.assign(motion.current, constructionPose(value / 100))
    setProgress(value)
    setActive(value === 0 ? planStop : value === 100 ? modelStop : null)
  }

  function inspectInterior(value, animate = false) {
    exploring.current = true
    cameraTween.current?.kill()
    setActive(null)
    setStage(4)
    setDayProgress(0)
    setExteriorProgress(0)
    setDesignIndex(0)
    setProgress(100)
    const pose=interiorPose(value)
    if(animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cameraTween.current=gsap.to(motion.current,{...pose,duration:1.1,ease:'power2.inOut',onUpdate:()=>setInteriorProgress(Math.round(motion.current.open*100))})
    } else {
      Object.assign(motion.current,pose)
      setInteriorProgress(Math.round(value*100))
    }
  }

  function chooseDesign(index) {
    exploring.current=true
    cameraTween.current?.kill()
    setActive(null)
    setStage(5)
    setDayProgress(0)
    setExteriorProgress(0)
    setProgress(100)
    setInteriorProgress(100)
    const pose=designPose(index)
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(motion.current,pose)
      setDesignIndex(index)
    } else {
      cameraTween.current=gsap.to(motion.current,{...pose,duration:1.1,ease:'power2.inOut',onUpdate:()=>setDesignIndex(Math.round(motion.current.design||0))})
    }
  }

  function inspectDay(value,animate=false) {
    exploring.current=true
    cameraTween.current?.kill()
    setActive(null)
    setStage(6)
    setExteriorProgress(0)
    setProgress(100)
    setInteriorProgress(100)
    setDesignIndex(2)
    const pose=dayPose(value)
    if(animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cameraTween.current=gsap.to(motion.current,{...pose,duration:1.3,ease:'power2.inOut',onUpdate:()=>setDayProgress(Math.round((motion.current.day||0)*100))})
    } else {Object.assign(motion.current,pose);setDayProgress(Math.round(value*100))}
  }

  function inspectExterior(value,animate=false) {
    exploring.current=true
    cameraTween.current?.kill()
    setActive(null)
    setStage(7)
    setProgress(100)
    setInteriorProgress(100)
    setDesignIndex(2)
    setDayProgress(100)
    const pose=exteriorPose(value)
    if(animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cameraTween.current=gsap.to(motion.current,{...pose,duration:1.5,ease:'power2.inOut',onUpdate:()=>setExteriorProgress(Math.round((motion.current.exterior||0)*100))})
    } else {Object.assign(motion.current,pose);setExteriorProgress(Math.round(value*100))}
  }

  function replay() {
    cameraTween.current?.kill()
    exploring.current = false
    setProgress(0)
    setDayProgress(0)
    setExteriorProgress(0)
    setDesignIndex(0)
    setInteriorProgress(0)
    setActive(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTake(value => value + 1)
  }

  return (
    <main>
      <header><span>▦ &nbsp; KÂĞIT ATÖLYESİ</span><span>HAREKET ÇALIŞMASI / 01</span></header>
      <section>
        <div className="intro">
          <p className="index">01 / MİMARİ ESKİZ</p>
          <h1>Bir çizgiden bir mekâna.</h1>
          <p>Işığın ve çizgilerin izinde, çizim masasına yaklaş.</p>
        </div>
        <div className="atelier-journey" ref={journey}>
          <figure className="atelier-frame">
            <div className="viewport" ref={viewport}>
              <Canvas shadows={PCFShadowMap} gl={{ antialias: true, toneMapping: NoToneMapping, localClippingEnabled: true }} dpr={[1, 1.5]} camera={{ position: atelierViews[0].camera, fov: 47 }}
                fallback={<p className="fallback">3D önizleme için WebGL gerekir.</p>}>
                <color attach="background" args={['#e8edf0']} />
                <IllustrationPalette motion={motion}>
                  <Desk motion={motion} markers={markers} finish={finish.color} />
                </IllustrationPalette>
              </Canvas>
              <div className="atelier-grain" aria-hidden="true" />
              {stage >= 4 && interiorProgress > 70 && <div className="interior-caption">
                <p className="index">{stage === 7 ? '07 / DIŞARIDAN · EVİN IŞIĞI' : stage === 6 ? '06 / YAŞAM · GÜNÜN İÇİNDEN' : stage === 5 ? '05 / İÇ MEKÂN TASARIMLARI' : '04 / DÖRDÜNCÜ KAT'}</p>
                <strong>{stage === 7 ? (exteriorProgress>85?'Kâğıt Atölyesi':'İçeriden dışarıya.') : stage === 6 ? dayState(dayProgress/100).label : stage === 5 ? interiorDesigns[designIndex].name : 'Yaşamın içinden.'}</strong>
                <p>{stage === 7 ? (exteriorProgress>85?'Bir çizgiden bir mekâna.':'Ev kapanır, ışığı kalır.') : stage === 6 ? (dayProgress < 65 ? 'Işık ilerler, gölgeler uzar.' : 'Dışarıda akşam, içeride sıcak ışık.') : stage === 5 ? interiorDesigns[designIndex].description : 'Salon · Mutfak · Yatak odası · Çalışma alanı'}</p>
              </div>}
              {ready && active && stops.map((stop, index) => (
                <button className="hotspot" key={stop.id} ref={node => { markers.current[index] = node }}
                  aria-label={stop.title} aria-pressed={active.id === stop.id}
                  onClick={() => selectStop(stop)}>{stop.number}</button>
              ))}
            </div>
            <figcaption><span>{stage === 7 ? '07 / DIŞARIDAN · EVİN IŞIĞI' : stage === 6 ? '06 / YAŞAM · GÜNÜN İÇİNDEN' : stage === 5 ? '05 / TASARIM · AYNI EV, ÜÇ YORUM' : stage === 4 ? '04 / İÇ MEKÂN · KATLAR ARALANIYOR' : stage === 3 ? '03 / MAKET · ÇİZGİLER YÜKSELİYOR' : stage === 2 ? '02 / ESKİZ · PLANIN ÇİZGİLERİ' : '01 / ATÖLYE · MASAYA YAKLAŞMAK İÇİN KAYDIR'}</span>
              <button onClick={replay}>↻ &nbsp;Başa dön</button>
            </figcaption>
          </figure>
        </div>
        <div className="construction">
          <div className="construction-heading">
            <label htmlFor="construction-progress">03 · Eskizden Makete</label>
            <span aria-hidden="true">%{progress}</span>
          </div>
          <input id="construction-progress" type="range" min="0" max="100"
            value={progress} onChange={scrub} disabled={!ready}
            aria-valuetext={`Yüzde ${progress}`} />
          <div className="construction-labels" aria-hidden="true"><span>Plan</span><span>Maket</span></div>
        </div>
        <div className="construction">
          <div className="construction-heading">
            <label htmlFor="interior-progress">04 · Maketin İçinde</label>
            <span aria-hidden="true">%{interiorProgress}</span>
          </div>
          <input id="interior-progress" type="range" min="0" max="100" value={interiorProgress}
            onChange={event=>inspectInterior(Number(event.target.value)/100)} disabled={!ready}
            aria-valuetext={`İç mekân yüzde ${interiorProgress} açık`} />
          <div className="construction-labels" aria-hidden="true"><span>Birleşik yapı</span><span>İç mekân</span></div>
        </div>
        <section className="design-picker" aria-labelledby="design-heading">
          <p className="index">05 / AYNI EV, ÜÇ YORUM</p>
          <h2 id="design-heading">Bir mekân, farklı hisler.</h2>
          <p>Kat açıldıktan sonra kaydırmaya devam et veya bir tasarım seç.</p>
          <div className="design-options" role="group" aria-label="İç mekân tasarımı">
            {interiorDesigns.map((design,index)=><button key={design.id} disabled={!ready}
              aria-pressed={designIndex===index} onClick={()=>chooseDesign(index)}>
              <span className="design-swatches" aria-hidden="true">{['wood','fabric','rug'].map(kind=><i key={kind} style={{background:design.colors[kind]}} />)}</span>
              <strong>{design.name}</strong><span>{design.description}</span>
            </button>)}
          </div>
        </section>
        <div className="construction">
          <div className="construction-heading"><label htmlFor="day-progress">06 · Günün İçinden</label><span>{dayState(dayProgress/100).label}</span></div>
          <input id="day-progress" type="range" min="0" max="100" value={dayProgress} disabled={!ready}
            onChange={event=>inspectDay(Number(event.target.value)/100)} aria-valuetext={dayState(dayProgress/100).label} />
          <div className="construction-labels" aria-hidden="true"><span>Sabah</span><span>Akşam</span></div>
        </div>
        <div className="construction">
          <div className="construction-heading"><label htmlFor="exterior-progress">07 · Evin Işığı</label><span aria-hidden="true">%{exteriorProgress}</span></div>
          <input id="exterior-progress" type="range" min="0" max="100" value={exteriorProgress} disabled={!ready}
            onChange={event=>inspectExterior(Number(event.target.value)/100)} aria-valuetext={`Dış görünüm yüzde ${exteriorProgress}`} />
          <div className="construction-labels" aria-hidden="true"><span>Pencerenin içinden</span><span>Masadaki maket</span></div>
        </div>
        <nav className="stops" aria-label="Çalışma masasını keşfet">
          {stops.map(stop => (
            <button key={stop.id} disabled={!ready} aria-pressed={active?.id === stop.id}
              onClick={() => selectStop(stop)}>{stop.number} · {stop.title}</button>
          ))}
          <button disabled={!ready} onClick={()=>inspectInterior(1,true)}>04 · İç mekânı keşfet</button>
          <button disabled={!ready} onClick={()=>inspectDay(1,true)}>06 · Akşamın içinden</button>
          <button disabled={!ready} onClick={()=>inspectExterior(1,true)}>07 · Gece maketi</button>
          {(active || progress < 100) && <button onClick={() => selectStop(null)}>Genel görünüm</button>}
        </nav>
        <div aria-live="polite">
          {active && (
            <section className="detail" aria-labelledby="detail-title">
              <p className="index">DETAY / {active.number}</p>
              <h2 id="detail-title">{active.title}</h2>
              <p>{active.description}</p>
              {active === modelStop && progress === 100 && (
                <button onClick={() => selectStop(materialsStop)}>Cephe malzemesini seç</button>
              )}
              {active === materialsStop && (
                <div className="swatches" role="group" aria-label="Cephe malzemesi">
                  {materials.map(material => (
                    <button key={material.name} aria-pressed={finish === material}
                      onClick={() => setFinish(material)}>
                      <span aria-hidden="true" style={{ background: material.color }} />
                      {material.name}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </main>
  )
}
