'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { MathUtils, Vector3 } from 'three'
import Architects from './architects'

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
const atelierViews = [
  { camera: [3.7, 2.35, -7.8], target: [0, .58, .2] },
  { camera: [.9, 2.05, -4.6], target: [-.52, .46, -.3] },
  { camera: [-.26, 2.15, -2.8], target: [-1.13, .2, -.54] },
]

function atelierPose(progress) {
  const index = progress < .5 ? 0 : 1
  const amount = MathUtils.smoothstep(progress * 2 - index, 0, 1)
  const start = cameraPose(atelierViews[index])
  const end = cameraPose(atelierViews[index + 1])
  return {
    ...Object.fromEntries(Object.keys(start).map(key => [key, MathUtils.lerp(start[key], end[key], amount)])),
    build: 0,
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

function Box({ position, size, color, rotation }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshToonMaterial color={color} />
    </mesh>
  )
}

function Room() {
  return (
    <group>
      <Box position={[0, -1.46, 0]} size={[13, .12, 20]} color="#d8ae98" />
      {Array.from({ length: 19 }, (_, index) => (
        <Box key={index} position={[-6 + index * .66, -1.397, 0]} size={[.012, .004, 18]} color="#b77e6b" />
      ))}
      <Box position={[0, 1.25, 3.2]} size={[12, 5.35, .16]} color="#efdbc4" />
      <Box position={[0, -1.22, 3.08]} size={[12, .28, .08]} color="#9c3c31" />
      <Box position={[-4.4, -.88, .4]} size={[.18, 1.04, 5.6]} color="#9b4135" />
      <Box position={[-4.4, 2.8, .4]} size={[.18, 1.3, 5.6]} color="#edceb4" />
      <Box position={[-4.52, .91, .4]} size={[.06, 2.53, 5.6]} color="#f8d9b5" />
      {[-2.4, -.55, 1.3, 3.2].map(z => (
        <Box key={z} position={[-4.37, .91, z]} size={[.15, 2.58, .1]} color="#86372b" />
      ))}
      <Box position={[-4.35, .76, .4]} size={[.16, .075, 5.6]} color="#86372b" />
      <Box position={[-4.32, -.33, .4]} size={[.35, .11, 5.7]} color="#f5dfc4" />
      {[[-1.65, 1.5, .13], [-.18, 1.8, -.1], [1.27, 1.43, .07]].map(([x, y, angle], index) => (
        <group key={index} position={[x, y, 3.09]} rotation={[0, 0, angle]}>
          <Box position={[0, 0, 0]} size={[1.12, .83, .025]} color="#fff0d7" />
          <Box position={[0, .32, -.028]} size={[.1, .045, .03]} color="#9a382e" />
          {[-.25, .25].map(line => (
            <Box key={line} position={[line, -.03, -.025]} size={[.013, .45, .01]} color="#ab6856" />
          ))}
          {[-.25, .18].map(line => (
            <Box key={line} position={[0, line, -.025]} size={[.51, .013, .01]} color="#ab6856" />
          ))}
        </group>
      ))}
      <Box position={[3.15, -.75, 2.75]} size={[2.15, 1.3, .62]} color="#8a332a" />
      {[-.4, .05, .55].map((offset, index) => (
        <Box key={offset} position={[3.15 + offset, .04 + index * .1, 2.72]}
          size={[.5, .13, .32]} color={index === 1 ? '#e6c7a8' : '#a24637'} rotation={[0, -.12, 0]} />
      ))}
    </group>
  )
}

function Desk({ motion, markers, finish, reducedMotion }) {
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
      <ambientLight intensity={1.4} />
      <directionalLight position={[-3, 7, 5]} intensity={2.5} />
      <Room />
      <Box position={[0, 0, 0]} size={[5, .22, 3]} color={ink} />
      {[-2.18, 2.18].flatMap(x => [-1.15, 1.15].map(z => (
        <Box key={x + ':' + z} position={[x, -.73, z]} size={[.18, 1.35, .18]} color="#69231c" />
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
        {[-.675, .975].map(x => (
          <Box key={x} position={[x, .201, .01]} size={[.022, .01, 1.24]} color={ink} />
        ))}
        {[-.61, .63].map(z => (
          <Box key={z} position={[.15, .201, z]} size={[1.65, .01, .022]} color={ink} />
        ))}
        <Box position={[.15, .201, .01]} size={[.022, .01, 1.24]} color={ink} />
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
      <Architects reducedMotion={reducedMotion} />
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
  const reducedMotion = useRef(false)
  const [take, setTake] = useState(0)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(null)
  const [finish, setFinish] = useState(materials[0])

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function updateJourney() {
      if (exploring.current) return
      const track = journey.current
      const distance = track.offsetHeight - viewport.current.parentElement.offsetHeight
      const progress = MathUtils.clamp(-track.getBoundingClientRect().top / Math.max(distance, 1), 0, 1)
      reducedMotion.current = preference.matches
      Object.assign(motion.current, atelierPose(preference.matches ? 1 : progress))
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
          <h1>Bir çizgiden<br />bir mekâna.</h1>
          <p>Mimarların çizimlerini izle, planın makete dönüşümünü keşfet.</p>
        </div>
        <div className="atelier-journey" ref={journey}>
          <figure className="atelier-frame">
            <div className="viewport" ref={viewport}>
              <Canvas dpr={[1, 1.5]} camera={{ position: atelierViews[0].camera, fov: 48 }}
                fallback={<p className="fallback">3D önizleme için WebGL gerekir.</p>}>
                <color attach="background" args={['#e1bba6']} />
                <Desk motion={motion} markers={markers} finish={finish.color} reducedMotion={reducedMotion} />
              </Canvas>
              {ready && active && stops.map((stop, index) => (
                <button className="hotspot" key={stop.id} ref={node => { markers.current[index] = node }}
                  aria-label={stop.title} aria-pressed={active.id === stop.id}
                  onClick={() => selectStop(stop)}>{stop.number}</button>
              ))}
            </div>
            <figcaption><span>01 / ATÖLYE · MASAYA YAKLAŞMAK İÇİN KAYDIR</span>
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
