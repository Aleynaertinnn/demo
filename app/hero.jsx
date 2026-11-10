'use client'

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { BoxGeometry, EdgesGeometry, MathUtils, Vector3, NoToneMapping, PCFShadowMap } from 'three'
import { IllustrationPalette, IllustrationMaterial } from './illustration'
import { exteriorState } from './exterior-cycle.mjs'
import CityView from './city-view'
import WallSheets from './wall-sheets'
import DaylightScene from './daylight-scene'
import { journeyTime, journeyLabel } from './day-cycle.mjs'
import { interiorBase } from './interior-geometry.mjs'
import { interiorDesigns, designAtProgress } from './interior-designs.mjs'
import ArchitectureModel from './architecture-model'
import AtelierFurniture from './atelier-furniture'
import AtelierWindow from './atelier-window'
import FinaleSheet, { finalePaper } from './finale-sheet'
import { atelierLayout } from './atelier-layout.mjs'
import DraftingSheets, { ProjectSketch } from './drafting-sheets'

const sketchStart = .6
const exteriorStart = .85
const finaleStart = .86
const lifeStart = .82 * exteriorStart
const designStart = .78 * lifeStart
const interiorStart = .72 * designStart
const modelStart = .62 * interiorStart

const atelierViews = [
  { camera: [-.8, 2.3, -6.2], target: [.1, .65, 0] },
  { camera: [-1.15, 2.85, -4.1], target: [-.46, .19, -.16] },
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

function constructionPose(progress) {
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

function interiorPose(progress) {
  const wide=cameraPose({camera:[2.65,3.7,2.75],target:[.05,1.8,.01]})
  const start=progress<.38 ? constructionPose(1) : wide
  const end=progress<.38 ? wide : cameraPose({camera:[1.1,3.1,1.5],target:[.15,1.14,.01]})
  const amount=progress<.38 ? MathUtils.smoothstep(progress,0,.38) : MathUtils.smoothstep(progress,.38,1)
  return {
    ...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(start[key],end[key],amount)])),
    build:1,sketch:1,open:progress,design:0,day:0,exterior:0,
  }
}

function designPose(value) {
  const views=[interiorPose(1),cameraPose({camera:[.5,3.05,1.65],target:[.15,1.14,.01]}),cameraPose({camera:[-.35,3.1,1.55],target:[.15,1.14,.01]})]
  const index=Math.min(1,Math.floor(value)),amount=MathUtils.smoothstep(value-index,0,1)
  return {
    ...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),
    build:1,sketch:1,open:1,design:value,day:0,exterior:0,
  }
}

function dayPose(progress) {
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

function exteriorPose(progress) {
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

function finalePose(progress) {
  const views=[exteriorPose(1),exteriorPose(1),cameraPose(atelierViews[0]),
    cameraPose({camera:[finalePaper[0],1.8,finalePaper[2]-.38],target:finalePaper})]
  const knots=[0,.12,.48,.8]
  let index=0
  while(index<knots.length-2 && progress>knots[index+1])index++
  const amount=MathUtils.smoothstep(progress,knots[index],knots[index+1])
  return {...Object.fromEntries(['x','y','z','tx','ty','tz'].map(key=>[key,MathUtils.lerp(views[index][key],views[index+1][key],amount)])),build:1,sketch:1,open:0,design:2,day:1,exterior:1,finale:progress}
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

function DeskDetails() {
  return (
    <group>
      {/* Thin page blocks and offset covers replace solid book-like cubes. */}
      {[0, 1, 2].map(index => (
        <group key={index} position={[2.55 - index * .035, .075 + index * .085, .35]} rotation={[0, -.13 + index * .12, 0]}>
          <Box position={[0, .035, 0]} size={[.47, .065, .64]} color="#f9f6e9" outline />
          {[0, .072].map(y => <Box key={y} position={[0, y, 0]} size={[.49, .008, .67]} color={index === 1 ? '#3459c5' : '#d1dce7'} outline />)}
          {[.02, .04, .055].map(y => <Box key={y} position={[.236, y, 0]} size={[.001, .002, .6]} color="#acbfce" />)}
        </group>
      ))}
      <Box position={[2.1,.079,-.25]} size={[.045,.014,.92]} color="#b6c8d7" rotation={[0,-.12,0]} />
      <group position={[2.35,.075,-1.15]}>
        {[0,1,2].map(i=><Box key={i} position={[i*.3,.008,0]} size={[.24,.016,.32]} color={['#c9d9e5','#eee8d6','#9aaec2'][i]} outline />)}
      </group>
      <group position={[1.95, .09, .52]} rotation={[Math.PI / 2, 0, -.32]}>
        <mesh castShadow><cylinderGeometry args={[.018, .018, .67, 6]} /><IllustrationMaterial color="#2451c4" /></mesh>
        <mesh position={[0, .39, 0]}><coneGeometry args={[.018, .11, 6]} /><IllustrationMaterial color="#dedbc7" /></mesh>
        <mesh position={[0, .45, 0]}><coneGeometry args={[.006, .025, 6]} /><IllustrationMaterial color="#26436f" /></mesh>
      </group>

    </group>
  )
}

function Room({motion}) {
  const wallHeight = atelierLayout.ceiling - atelierLayout.floor
  const wallCenter = (atelierLayout.ceiling + atelierLayout.floor) / 2
  return <group name="atelier-room">
    <Box position={[0,-1.46,0]} size={[12.2,.12,25]} color="#eee9d9" inkStrength={.38} />
    {Array.from({length:15},(_,i)=><Box key={i} position={[-5.75+i*.82,-1.397,0]} size={[.008,.002,25]} color="#c9ccca" />)}
    <Box position={[0,wallCenter,6.05]} size={[12.4,wallHeight,.12]} color="#f5f0de" inkStrength={.58} />
    <Box position={[0,wallCenter,-7.1]} size={[12.4,wallHeight,.12]} color="#f5f0de" inkStrength={.48} />
    {/* Side wall is built around the door opening rather than behind the door leaf. */}
    <Box position={[-6.2,wallCenter,-6.3375]} size={[.12,wallHeight,1.425]} color="#e4e9eb" inkStrength={.48} />
    <Box position={[-6.2,wallCenter,1.0375]} size={[.12,wallHeight,10.025]} color="#e4e9eb" inkStrength={.48} />
    <Box position={[-6.2,(atelierLayout.floor+3.15+atelierLayout.ceiling)/2,-4.8]} size={[.12,wallHeight-3.15,1.65]} color="#e4e9eb" inkStrength={.48} />
    {/* A continuous ceiling closes the shell; daylight enters through the glazing. */}
    <Box position={[0,atelierLayout.ceiling+.06,-.5]} size={[12.5,.12,13.2]} color="#f6f2e6" inkStrength={.3} />
    <Box position={[0,-1.3,5.96]} size={[12,.15,.05]} color="#a7bdd4" />
    <AtelierWindow />
    <CityView motion={motion} />
    <WallSheets />
  </group>
}

function Desk({ motion }) {

  useFrame(({ camera }) => {
    const { x, y, z, tx, ty, tz, build } = motion.current
    // Widen the lens on tall screens; dollying backward would cross the room walls.
    const wideFraming = MathUtils.clamp(1.15 / camera.aspect, 1, 2.1)
    const framing = wideFraming
    const near=MathUtils.lerp(.1,.008,MathUtils.smoothstep(motion.current.day||0,.1,.5))
    if(Math.abs(camera.near-near)>.0001){camera.near=near;camera.updateProjectionMatrix()}
    const walking=MathUtils.smoothstep(motion.current.day||0,.05,.3)*(1-MathUtils.smoothstep(motion.current.exterior||0,.35,.9))
    const approach=MathUtils.smoothstep(motion.current.y,2.3,3.1)
    const lens=MathUtils.lerp(MathUtils.lerp(47,39,approach),47,walking)
    const fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(lens / 2)) * framing))
    if (Math.abs(camera.fov - fov) > .01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    camera.position.set(x, y, z)
    camera.lookAt(tx,ty,tz)
    camera.updateMatrixWorld()


  })

  return (
    <>
      <DaylightScene motion={motion} />
      <Room motion={motion} />
      <DeskDetails />
      <FinaleSheet motion={motion} />
      <AtelierFurniture />
      <group rotation={[0, .16, 0]}>
        <Box position={[.12, .077, .13]} size={[3.42, .006, 2.12]} color={paper} paperSurface />
        <Box position={[.2, .082, .06]} size={[3.25, .006, 2]} color={white} paperSurface />
        <ProjectSketch motion={motion} />
        <ArchitectureModel motion={motion} finish="#faf8ed" />
      </group>
      {[-.92, -.78].map((z, index) => (
        <mesh key={z} position={[1.48, .145 + index * .002, z]} rotation={[0, .12, Math.PI / 2]} castShadow>
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
  const motion = useRef(atelierPose(0))
  const [take, setTake] = useState(0)
  const [stage, setStage] = useState(1)
  const [interiorProgress, setInteriorProgress] = useState(0)
  const [designIndex, setDesignIndex] = useState(0)
  const [dayProgress, setDayProgress] = useState(0)
  const [exteriorProgress, setExteriorProgress] = useState(0)
  const [finaleProgress, setFinaleProgress] = useState(0)

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function updateJourney() {
      const track = journey.current
      const top = track.getBoundingClientRect().top
      const trackDistance = track.offsetHeight - viewport.current.parentElement.offsetHeight
      const remainingPage = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      const distance = Math.min(trackDistance, remainingPage - top)
      const progress = MathUtils.clamp(-top / Math.max(distance, 1), 0, 1)
      const timeline = preference.matches ? 1 : MathUtils.clamp(progress/finaleStart,0,1)
      const finale = preference.matches ? 1 : MathUtils.clamp((progress-finaleStart)/(1-finaleStart),0,1)
      const build = MathUtils.clamp((timeline - modelStart) / (interiorStart - modelStart), 0, 1)
      const opening=MathUtils.clamp((timeline-interiorStart)/(designStart-interiorStart),0,1)
      const design=designAtProgress(MathUtils.clamp((timeline-designStart)/(lifeStart-designStart),0,1))
      const day=MathUtils.clamp((timeline-lifeStart)/(exteriorStart-lifeStart),0,1)
      const outside=MathUtils.clamp((timeline-exteriorStart)/(1-exteriorStart),0,1)
      Object.assign(motion.current, {finale:0}, progress>=finaleStart || preference.matches ? finalePose(finale) : timeline < modelStart
        ? atelierPose(timeline / modelStart)
        : timeline < interiorStart ? constructionPose(build) : timeline < designStart ? interiorPose(opening) : timeline < lifeStart ? designPose(design) : timeline < exteriorStart ? dayPose(day) : exteriorPose(outside))
      setDesignIndex(Math.round(design))
      setDayProgress(Math.round(day*100))
      setExteriorProgress(Math.round(outside*100))
      setFinaleProgress(Math.round(finale*100))
      setInteriorProgress(Math.round(opening*100))
      setStage(progress>=finaleStart || preference.matches ? 8 : timeline >= exteriorStart ? 7 : timeline >= lifeStart ? 6 : timeline >= designStart ? 5 : timeline >= interiorStart ? 4 : timeline >= modelStart ? 3 : timeline >= sketchStart * modelStart ? 2 : 1)
    }

    updateJourney()
    window.addEventListener('scroll', updateJourney, { passive: true })
    window.addEventListener('resize', updateJourney)
    preference.addEventListener('change', updateJourney)
    return () => {
      window.removeEventListener('scroll', updateJourney)
      window.removeEventListener('resize', updateJourney)
      preference.removeEventListener('change', updateJourney)
    }
  }, [take])

  function replay() {
    setDayProgress(0)
    setExteriorProgress(0)
    setDesignIndex(0)
    setInteriorProgress(0)
    motion.current.finale=0
    setFinaleProgress(0)
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
                  <Desk motion={motion} />
                </IllustrationPalette>
              </Canvas>
              <div className="atelier-grain" aria-hidden="true" />
              {stage >= 4 && stage < 8 && interiorProgress > 70 && <div className="interior-caption">
                <p className="index">{stage === 7 ? '07 / DIŞARIDAN · EVİN IŞIĞI' : stage === 6 ? '06 / YAŞAM · GÜNÜN İÇİNDEN' : stage === 5 ? '05 / İÇ MEKÂN TASARIMLARI' : '04 / DÖRDÜNCÜ KAT'}</p>
                <strong>{stage === 7 ? (exteriorProgress>85?'Kâğıt Atölyesi':'İçeriden dışarıya.') : stage === 6 ? journeyLabel(dayProgress/100) : stage === 5 ? interiorDesigns[designIndex].name : 'Yaşamın içinden.'}</strong>
                <p>{stage === 7 ? (exteriorProgress>55?'Maketin çevresinde bir tur; camlar yerini buluyor.':'Ev kapanır, dışarıya açılırız.') : stage === 6 ? (dayProgress < 28 ? 'Gün ışığı yerini sıcak aydınlatmalara bırakır.' : dayProgress < 68 ? 'Yemek alanından geçerek salona ilerle.' : 'Salondaki ışığı izle, ardından pencereden dışarı çık.') : stage === 5 ? interiorDesigns[designIndex].description : 'Salon · Mutfak · Yatak odası · Çalışma alanı'}</p>
              </div>}
              {stage === 8 && finaleProgress > 80 && <div className="finale-caption" style={{opacity:MathUtils.smoothstep(finaleProgress/100,.80,.97)}}>
                <p className="index">08 / YENİ BİR ÇİZGİ</p>
                <h2>Her mekân,<br />bir çizgiyle başlar.</h2>
                <button onClick={replay}>Yeniden başla ↗</button>
              </div>}

            </div>
            <figcaption><span>{stage === 8 ? '08 / YENİ BİR ÇİZGİ' : stage === 7 ? '07 / DIŞARIDAN · EVİN IŞIĞI' : stage === 6 ? '06 / YAŞAM · GÜNÜN İÇİNDEN' : stage === 5 ? '05 / TASARIM · AYNI EV, ÜÇ YORUM' : stage === 4 ? '04 / İÇ MEKÂN · KATLAR ARALANIYOR' : stage === 3 ? '03 / MAKET · ÇİZGİLER YÜKSELİYOR' : stage === 2 ? '02 / ESKİZ · PLANIN ÇİZGİLERİ' : '01 / ATÖLYE · MASAYA YAKLAŞMAK İÇİN KAYDIR'}</span>
              <button onClick={replay}>↻ &nbsp;Başa dön</button>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  )
}
