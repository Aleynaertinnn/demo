'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

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

function Desk({ motion }) {
  useFrame(({ camera }) => {
    const p = motion.current.value
    camera.position.set(5.6 - 2.2 * p, 4.4 - 1.1 * p, 7 - 2.4 * p)
    camera.lookAt(0, 0.35, 0)
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
        <Box position={[.15, .23, .01]} size={[1.65, .08, 1.24]} color={ink} />
        <Box position={[.15, .49, .01]} size={[1.32, .47, .94]} color={white} />
        <Box position={[.03, .82, -.04]} size={[1.02, .22, .76]} color={paper} />
        <Box position={[-.11, 1.01, -.09]} size={[.7, .17, .58]} color={white} />
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
  const motion = useRef({ value: 0 })
  const [take, setTake] = useState(0)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      motion.current.value = 1
      return
    }

    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        .fromTo(viewport.current, { clipPath: 'inset(49% 48% 49% 48%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.65 }, 0)
        .fromTo(motion.current, { value: 0 }, { value: 1, duration: 1.65 }, 0)
        .fromTo(copy.current.children, { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: .65, stagger: .12, ease: 'power2.out' }, .55)
    })

    return () => context.revert()
  }, [take])

  return (
    <main>
      <header><span>▦ &nbsp; KÂĞIT ATÖLYESİ</span><span>HAREKET ÇALIŞMASI / 01</span></header>
      <section>
        <div className="intro" ref={copy}>
          <p className="index">01 / MİMARİ ESKİZ</p>
          <h1>Bir çizgiden<br />bir mekâna.</h1>
          <p>Bir mimarın masasına doğru kısa bir kamera hareketi.</p>
        </div>
        <figure>
          <div className="viewport" ref={viewport}>
            <Canvas dpr={[1, 1.5]} camera={{ position: [5.6, 4.4, 7], fov: 43 }}
              fallback={<p className="fallback">3D önizleme için WebGL gerekir.</p>}>
              <color attach="background" args={['#aab8d9']} />
              <Desk motion={motion} />
            </Canvas>
          </div>
          <figcaption><span>ŞEKİL 01 — ÇALIŞMA MASASI</span>
            <button onClick={() => setTake(value => value + 1)}>↻ &nbsp;Tekrar oynat</button>
          </figcaption>
        </figure>
      </section>
    </main>
  )
}
