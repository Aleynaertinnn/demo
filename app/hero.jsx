'use client'

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { BoxGeometry, EdgesGeometry, MathUtils, Vector3 } from 'three'
import DraftingSheets, { ProjectSketch } from './drafting-sheets'

const stops = [
  { id: 'plan', number: '01', title: 'Plan', point: [-.88, .23, .68],
    camera: [.15, 4.55, 1.45], target: [.15, .18, 0],
    description: 'Kareli eskiz üzerinden yapının zemin oturumunu ve dolaşımını incele.' },
  { id: 'model', number: '02', title: 'Maket', point: [-.11, 1.16, -.09],
    camera: [2.45, 2.3, 3.05], target: [0, .55, 0],
    description: 'Geri çekilen katlar, yapının kütlesini küçültür ve teraslara yer açar.' },
  { id: 'materials', number: '03', title: 'Malzemeler', point: [1.65, .28, .82],
    camera: [3.1, 2.8, 3.4], target: [.85, .42, .37],
    description: 'Bir yüzey seç ve maketin ana cephesinin rengini karşılaştır.' },
]

const materials = [
  { name: 'Kireç taşı', color: '#f7efdb' },
  { name: 'Tuğla', color: '#b35e42' },
  { name: 'Beton', color: '#909da9' },
]

const overview = { camera: [2.7, 3.5, 5.7], target: [0, .52, -.55] }
const sketchStart = .6

const atelierViews = [
  { camera: [-1.2, 1.72, -5.95], target: [.02, .15, .19] },
  { camera: [-1.62, 2.07, -3.62], target: [-.46, .19, -.16] },
  { camera: [-.68, 2.65, -1.75], target: [-.56, .22, -.28] },
  { camera: [.16, 2.02, -.37], target: [.15, .21, .01] },
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
    sketch: MathUtils.smoothstep(sketch, .18, .96),
  }
}

function cameraPose({ camera, target }) {
  return { x: camera[0], y: camera[1], z: camera[2], tx: target[0], ty: target[1], tz: target[2] }
}

const [planStop, modelStop, materialsStop] = stops

function constructionPose(progress) {
  const plan = cameraPose(planStop)
  const model = cameraPose(modelStop)
  return {
    x: MathUtils.lerp(plan.x, model.x, progress),
    y: MathUtils.lerp(plan.y, model.y, progress),
    z: MathUtils.lerp(plan.z, model.z, progress),
    tx: MathUtils.lerp(plan.tx, model.tx, progress),
    ty: MathUtils.lerp(plan.ty, model.ty, progress),
    tz: MathUtils.lerp(plan.tz, model.tz, progress),
    build: progress,
  }
}

const ink = '#a13025'
const paper = '#e8d8b6'
const white = '#f7efdb'

function Box({ position, size, color, rotation, outline = false, castShadow = false }) {
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
      <meshToonMaterial color={color} />
      {edges && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#632119" transparent opacity={.62} />
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

function Plant() {
  return (
    <group position={[-3.14, -1.39, .38]}>
      <mesh position={[0, .34, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[.4, .29, .67, 24]} />
        <meshToonMaterial color="#853529" />
      </mesh>
      <mesh position={[0, .67, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.38, .027, 8, 28]} />
        <meshToonMaterial color="#5c231e" />
      </mesh>
      <Box position={[0, 1.38, 0]} size={[.029, 1.51, .029]} color="#67271e" />
      {leaves.map(([x, y, z, tilt], index) => (
        <group key={y} position={[x, y, z]} rotation={[.1 + index * .08, .23 * (index % 3), tilt]}>
          <mesh scale={[.25, .52, .045]} castShadow receiveShadow>
            <sphereGeometry args={[1, 10, 8]} />
            <meshToonMaterial color={index % 2 ? '#9d3e32' : '#70261f'} />
          </mesh>
          <Box position={[0, 0, -.045]} size={[.012, .84, .01]} color="#d07c61" />
        </group>
      ))}
    </group>
  )
}

function Room() {
  return (
    <group>
      <Box position={[0, -1.46, 0]} size={[13, .12, 20]} color="#c49175" />
      {Array.from({ length: 19 }, (_, index) => (
        <Box key={index} position={[-6 + index * .66, -1.397, 0]} size={[.012, .004, 18]} color="#b77e6b" />
      ))}
      <Box position={[0, 1.55, 3.2]} size={[22, 6, .16]} color="#e6bb96" />
      <Box position={[-4.75, 1.58, -.38]} size={[.16, 6, 7.25]} color="#a05b4e" />
      <Box position={[0, 4.15, -.24]} size={[12, .18, 8]} color="#c48970" />
      <Box position={[0, -1.22, 3.08]} size={[12, .28, .08]} color="#9c3c31" />
      <group position={[-1.3, 0, 0]} scale={[-1, 1, 1]}>
        <Box position={[-4.4, -.88, .4]} size={[.18, 1.04, 5.6]} color="#a74735" castShadow />
        <Box position={[-4.4, 2.8, .4]} size={[.18, 1.3, 5.6]} color="#e3ba9b" castShadow />
        <mesh position={[-7.4, .9, .8]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[12, 6]} />
          <meshBasicMaterial color="#d68565" />
        </mesh>
        <mesh position={[-7.32, .9, -1.05]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[.46, 48]} />
          <meshBasicMaterial color="#ffe0a1" toneMapped={false} />
        </mesh>
        {[[-2.2, 1.4], [-.8, 2], [.65, 1.6], [2, 2.6], [3.15, 1.9]].map(([z, height]) => (
          <mesh key={z} position={[-7.1, -1.35 + height / 2, z]}>
            <boxGeometry args={[.12, height, 1.06]} />
            <meshBasicMaterial color="#855052" />
          </mesh>
        ))}
        {[-2.4, -.55, 1.3, 3.2].map(z => (
          <Box key={z} position={[-4.37, .91, z]} size={[.15, 2.58, .1]} color="#763126" castShadow outline />
        ))}
        <Box position={[-4.35, .76, .4]} size={[.16, .075, 5.6]} color="#763126" castShadow />
        <Box position={[-4.32, -.33, .4]} size={[.35, .11, 5.7]} color="#f5dfc4" />
          <Box position={[-4.4, .91, -3.4]} size={[.18, 5.4, 2]} color="#a05b4e" castShadow />
      </group>
      {[[-2.35, 1.3, .11], [-.94, 1.47, -.12], [.53, 1.16, .07], [-.64, .43, .09]].map(([x, y, angle], index) => (
        <group key={index} position={[x, y, 3.09]} rotation={[0, 0, angle]}>
          <Box position={[0, 0, 0]} size={[1.23, .9, .025]} color="#fff0d7" outline />
          <Box position={[0, .32, -.028]} size={[.1, .045, .03]} color="#9a382e" />
          {[-.25, .25].map(line => (
            <Box key={line} position={[line, -.03, -.025]} size={[.013, .45, .01]} color="#ab6856" />
          ))}
          {[-.25, .18].map(line => (
            <Box key={line} position={[0, line, -.025]} size={[.51, .013, .01]} color="#ab6856" />
          ))}
        </group>
      ))}
      <Plant />
      <Box position={[-3.08, -.75, 2.75]} size={[2.15, 1.3, .62]} color="#8a332a" outline />
      {[-.4, .05, .55].map((offset, index) => (
        <Box key={offset} position={[-3.08 + offset, .04 + index * .1, 2.72]}
          size={[.5, .13, .32]} color={index === 1 ? '#e6c7a8' : '#a24637'} rotation={[0, -.12, 0]} />
      ))}
    </group>
  )
}

function Desk({ motion, markers, finish }) {
  const projection = useRef(new Vector3())
  const floors = useRef([])

  useFrame(({ camera, size }) => {
    const { x, y, z, tx, ty, tz, build } = motion.current
    camera.position.set(x, y, z)
    camera.lookAt(tx, ty, tz)
    camera.updateMatrixWorld()

    floors.current.forEach((floor, index) => {
      if (!floor) return
      const height = MathUtils.clamp(build * 3 - index, 0, 1)
      floor.visible = height > 0
      floor.scale.y = Math.max(height, .001)
    })

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
      <hemisphereLight args={['#f2bb9b', '#8f4a52', 1.22]} />
      <directionalLight position={[9, 3.4, -4.8]} color="#ffc079" intensity={2.5} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8}
        shadow-camera-top={7} shadow-camera-bottom={-7} shadow-normalBias={.025} />
      <Room />
      <Box position={[0, 0, 0]} size={[5, .22, 3]} color="#9f4939" castShadow outline />
      {[-2.18, 2.18].flatMap(x => [-1.15, 1.15].map(z => (
        <Box key={x + ':' + z} position={[x, -.73, z]} size={[.18, 1.35, .18]} color="#69231c" castShadow outline />
      )))}
      <group rotation={[0, .16, 0]}>
        <Box position={[.12, .14, .13]} size={[3.42, .06, 2.12]} color={paper} />
        <Box position={[.2, .18, .06]} size={[3.25, .025, 2]} color={white} />
        {Array.from({ length: 14 }, (_, i) => (
          <Box key={i} position={[-1.3 + i * .225, .195, .06]} size={[.009, .002, 1.9]} color="#bf8e7a" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={i} position={[.2, .196, -.84 + i * .225]} size={[3.1, .002, .009]} color="#bf8e7a" />
        ))}
        <Box position={[-1.02, .202, .65]} size={[.76, .008, .55]} color="#e8d8b6" />
        {[-1.36, -.69].map(x => (
          <Box key={x} position={[x, .21, .65]} size={[.026, .012, .49]} color={ink} />
        ))}
        {[.42, .88].map(z => (
          <Box key={z} position={[-1.025, .21, z]} size={[.69, .012, .025]} color={ink} />
        ))}
        <Box position={[-1.09, .21, .59]} size={[.025, .012, .32]} color={ink} />
        <ProjectSketch motion={motion} />
        <group position={[0, .207, 0]} ref={node => { floors.current[0] = node }}>
          <Box position={[.15, .04, .01]} size={[1.65, .08, 1.24]} color={ink} />
          <Box position={[.15, .315, .01]} size={[1.32, .47, .94]} color={finish} />
          <Box position={[.15, .315, .485]} size={[.98, .16, .018]} color={ink} />
        </group>
        <group position={[0, .757, 0]} ref={node => { floors.current[1] = node }}>
          <Box position={[.03, .11, -.04]} size={[1.02, .22, .76]} color={paper} />
        </group>
        <group position={[0, .977, 0]} ref={node => { floors.current[2] = node }}>
          <Box position={[-.11, .085, -.09]} size={[.7, .17, .58]} color={finish} />
        </group>
      </group>
      <Box position={[1.65, .18, .9]} size={[.07, .06, .88]} rotation={[0, -.32, 0]} color="#dd6241" />
      <Box position={[-1.92, .19, -.8]} size={[.5, .15, .45]} color={white} />
      <Box position={[-1.92, .74, -.8]} size={[.075, 1.08, .075]} color={white} />
      <Box position={[-1.62, 1.28, -.8]} size={[.65, .075, .075]} color={white} />
      <Box position={[-1.31, 1.21, -.8]} size={[.39, .17, .35]} color="#dd6241" />
      {[-.92, -.78].map((z, index) => (
        <mesh key={z} position={[1.48, .206 + index * .025, z]} rotation={[0, .12, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[.075, .075, .85, 20]} />
          <meshToonMaterial color={index ? '#d5a487' : '#f6dfbb'} />
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
  const [isSketch, setIsSketch] = useState(false)
  const [active, setActive] = useState(null)
  const [finish, setFinish] = useState(materials[0])

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function updateJourney() {
      if (exploring.current) return
      const track = journey.current
      const top = track.getBoundingClientRect().top
      const trackDistance = track.offsetHeight - viewport.current.parentElement.offsetHeight
      const remainingPage = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      const distance = Math.min(trackDistance, remainingPage - top)
      const progress = MathUtils.clamp(-top / Math.max(distance, 1), 0, 1)
      Object.assign(motion.current, atelierPose(preference.matches ? 1 : progress))
      setIsSketch(preference.matches || progress >= sketchStart)
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
    motion.current.sketch = 1
    setActive(stop)
    cameraTween.current?.kill()
    const value = stop === planStop ? 0 : 1
    const pose = stop === planStop || stop === modelStop
      ? constructionPose(value)
      : { ...cameraPose(stop ?? overview), build: value }
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
    motion.current.sketch = 1
    const value = Number(event.target.value)
    cameraTween.current?.kill()
    Object.assign(motion.current, constructionPose(value / 100))
    setProgress(value)
    setActive(value === 0 ? planStop : value === 100 ? modelStop : null)
  }

  function replay() {
    cameraTween.current?.kill()
    exploring.current = false
    setProgress(0)
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
          <p>Gün batımında çizim masasına yaklaş.</p>
        </div>
        <div className="atelier-journey" ref={journey}>
          <figure className="atelier-frame">
            <div className="viewport" ref={viewport}>
              <Canvas shadows dpr={[1, 1.5]} camera={{ position: atelierViews[0].camera, fov: 47 }}
                fallback={<p className="fallback">3D önizleme için WebGL gerekir.</p>}>
                <color attach="background" args={['#d68565']} />
                <Desk motion={motion} markers={markers} finish={finish.color} />
              </Canvas>
              <div className="atelier-grain" aria-hidden="true" />
              {ready && active && stops.map((stop, index) => (
                <button className="hotspot" key={stop.id} ref={node => { markers.current[index] = node }}
                  aria-label={stop.title} aria-pressed={active.id === stop.id}
                  onClick={() => selectStop(stop)}>{stop.number}</button>
              ))}
            </div>
            <figcaption><span>{isSketch ? '02 / ESKİZ · PLANIN ÇİZGİLERİ' : '01 / ATÖLYE · MASAYA YAKLAŞMAK İÇİN KAYDIR'}</span>
              <button onClick={replay}>↻ &nbsp;Başa dön</button>
            </figcaption>
          </figure>
        </div>
        <div className="construction">
          <div className="construction-heading">
            <label htmlFor="construction-progress">Eskizden Makete</label>
            <span aria-hidden="true">%{progress}</span>
          </div>
          <input id="construction-progress" type="range" min="0" max="100"
            value={progress} onChange={scrub} disabled={!ready}
            aria-valuetext={`Yüzde ${progress}`} />
          <div className="construction-labels" aria-hidden="true"><span>Plan</span><span>Maket</span></div>
        </div>
        <nav className="stops" aria-label="Çalışma masasını keşfet">
          {stops.map(stop => (
            <button key={stop.id} disabled={!ready} aria-pressed={active?.id === stop.id}
              onClick={() => selectStop(stop)}>{stop.number} · {stop.title}</button>
          ))}
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
