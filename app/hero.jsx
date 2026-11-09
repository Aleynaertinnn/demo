'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { Vector3 } from 'three'

const stops = [
  { id: 'plan', number: '01', title: 'Plan', point: [-1.15, .23, .68],
    camera: [-1.8, 4, 3.1], target: [-.8, .18, .4],
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

const overview = { camera: [3.4, 3.3, 4.6], target: [0, .35, 0] }
const opening = { camera: [5.6, 4.4, 7], target: overview.target }

function cameraPose({ camera, target }) {
  return { x: camera[0], y: camera[1], z: camera[2], tx: target[0], ty: target[1], tz: target[2] }
}

const ink = '#294ea5'
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

function Desk({ motion, markers, finish }) {
  const projection = useRef(new Vector3())

  useFrame(({ camera, size }) => {
    const { x, y, z, tx, ty, tz } = motion.current
    camera.position.set(x, y, z)
    camera.lookAt(tx, ty, tz)
    camera.updateMatrixWorld()

    stops.forEach(({ point }, index) => {
      const marker = markers.current[index]
      if (!marker) return
      const projected = projection.current.set(...point).project(camera)
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
      <Box position={[0, -1.46, 0]} size={[22, .12, 22]} color="#aab8d9" />
      <Box position={[0, 0, 0]} size={[5, .22, 3]} color={ink} />
      {[-2.18, 2.18].flatMap(x => [-1.15, 1.15].map(z => (
        <Box key={x + ':' + z} position={[x, -.73, z]} size={[.18, 1.35, .18]} color="#18356d" />
      )))}
      <group rotation={[0, .16, 0]}>
        <Box position={[.12, .14, .13]} size={[3.42, .06, 2.12]} color={paper} />
        <Box position={[.2, .18, .06]} size={[3.25, .025, 2]} color={white} />
        {Array.from({ length: 14 }, (_, i) => (
          <Box key={i} position={[-1.3 + i * .225, .195, .06]} size={[.009, .002, 1.9]} color="#9cafd0" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={i} position={[.2, .196, -.84 + i * .225]} size={[3.1, .002, .009]} color="#9cafd0" />
        ))}
        <Box position={[-1.02, .202, .65]} size={[.76, .008, .55]} color="#e8d8b6" />
        {[-1.36, -.69].map(x => (
          <Box key={x} position={[x, .21, .65]} size={[.026, .012, .49]} color={ink} />
        ))}
        {[.42, .88].map(z => (
          <Box key={z} position={[-1.025, .21, z]} size={[.69, .012, .025]} color={ink} />
        ))}
        <Box position={[-1.09, .21, .59]} size={[.025, .012, .32]} color={ink} />
        <Box position={[.15, .23, .01]} size={[1.65, .08, 1.24]} color={ink} />
        <Box position={[.15, .49, .01]} size={[1.32, .47, .94]} color={finish} />
        <Box position={[.03, .82, -.04]} size={[1.02, .22, .76]} color={paper} />
        <Box position={[-.11, 1.01, -.09]} size={[.7, .17, .58]} color={finish} />
        <Box position={[.15, .49, .485]} size={[.98, .16, .018]} color={ink} />
      </group>
      <Box position={[1.65, .18, .9]} size={[.07, .06, .88]} rotation={[0, -.32, 0]} color="#dd6241" />
      <Box position={[-1.92, .19, -.8]} size={[.5, .15, .45]} color={white} />
      <Box position={[-1.92, .74, -.8]} size={[.075, 1.08, .075]} color={white} />
      <Box position={[-1.62, 1.28, -.8]} size={[.65, .075, .075]} color={white} />
      <Box position={[-1.31, 1.21, -.8]} size={[.39, .17, .35]} color="#dd6241" />
    </>
  )
}

export default function Hero() {
  const viewport = useRef(null)
  const copy = useRef(null)
  const motion = useRef(cameraPose(opening))
  const markers = useRef([])
  const cameraTween = useRef(null)
  const [take, setTake] = useState(0)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(null)
  const [finish, setFinish] = useState(materials[0])

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      Object.assign(motion.current, cameraPose(overview))
      setReady(true)
      return
    }

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => setReady(true) })
        .fromTo(viewport.current, { clipPath: 'inset(49% 48% 49% 48%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.65 }, 0)
        .fromTo(motion.current, cameraPose(opening), { ...cameraPose(overview), duration: 1.65 }, 0)
        .fromTo(copy.current.children, { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: .65, stagger: .12, ease: 'power2.out' }, .55)
    })

    return () => {
      cameraTween.current?.kill()
      context.revert()
    }
  }, [take])

  function selectStop(stop) {
    setActive(stop)
    cameraTween.current?.kill()
    const pose = cameraPose(stop ?? overview)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(motion.current, pose)
      return
    }
    cameraTween.current = gsap.to(motion.current, { ...pose, duration: .85, ease: 'power2.inOut' })
  }

  function replay() {
    cameraTween.current?.kill()
    setReady(false)
    setActive(null)
    setTake(value => value + 1)
  }

  return (
    <main>
      <header><span>▦ &nbsp; KÂĞIT ATÖLYESİ</span><span>HAREKET ÇALIŞMASI / 01</span></header>
      <section>
        <div className="intro" ref={copy}>
          <p className="index">01 / MİMARİ ESKİZ</p>
          <h1>Bir çizgiden<br />bir mekâna.</h1>
          <p>Masadaki planı, maketi ve malzemeleri keşfet.</p>
        </div>
        <figure>
          <div className="viewport" ref={viewport}>
            <Canvas dpr={[1, 1.5]} camera={{ position: [5.6, 4.4, 7], fov: 43 }}
              fallback={<p className="fallback">3D önizleme için WebGL gerekir.</p>}>
              <color attach="background" args={['#aab8d9']} />
              <Desk motion={motion} markers={markers} finish={finish.color} />
            </Canvas>
            {ready && stops.map((stop, index) => (
              <button className="hotspot" key={stop.id} ref={node => { markers.current[index] = node }}
                aria-label={stop.title} aria-pressed={active?.id === stop.id}
                onClick={() => selectStop(stop)}>{stop.number}</button>
            ))}
          </div>
          <figcaption><span>ŞEKİL 01 — ÇALIŞMA MASASI</span>
            <button onClick={replay}>↻ &nbsp;Tekrar oynat</button>
          </figcaption>
        </figure>
        <nav className="stops" aria-label="Çalışma masasını keşfet">
          {stops.map(stop => (
            <button key={stop.id} disabled={!ready} aria-pressed={active?.id === stop.id}
              onClick={() => selectStop(stop)}>{stop.number} · {stop.title}</button>
          ))}
          {active && <button onClick={() => selectStop(null)}>Genel görünüm</button>}
        </nav>
        <div aria-live="polite">
          {active && (
            <section className="detail" aria-labelledby="detail-title">
              <p className="index">DETAY / {active.number}</p>
              <h2 id="detail-title">{active.title}</h2>
              <p>{active.description}</p>
              {active.id === 'materials' && (
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
