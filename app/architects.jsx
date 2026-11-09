import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const up = new Vector3(0, 1, 0)
const paper = '#f9efd8'
const ink = '#29477c'
const drawing = [
  [-.38, -.27], [.38, -.27], [.38, .27], [-.38, .27], [-.38, -.27],
  [-.02, -.27], [-.02, .04], [.38, .04], [.38, .27], [.14, .27],
  [.14, .04],
]
const elevation = [
  [-.4, .22], [-.4, -.08], [-.23, -.22], [.23, -.22], [.4, -.08],
  [.4, .22], [-.4, .22], [-.23, .22], [-.23, -.03], [-.04, -.03],
  [-.04, .22], [.11, .22], [.11, -.06], [.29, -.06], [.29, .22],
]

function Shape({ position, size, color, kind = 'box', rotation }) {
  return (
    <mesh position={position} rotation={rotation} scale={kind === 'sphere' ? size : undefined}>
      {kind === 'sphere'
        ? <sphereGeometry args={[1, 18, 12]} />
        : <boxGeometry args={size} />}
      <meshToonMaterial color={color} />
    </mesh>
  )
}

function Sheet({ position, angle, points, drawingProgress }) {
  const strokes = useRef([])

  useFrame(() => {
    if (!drawingProgress) return
    strokes.current.forEach((stroke, index) => {
      if (!stroke) return
      const amount = Math.max(0, Math.min(1, drawingProgress.current - index))
      stroke.visible = amount > 0
      stroke.scale.x = Math.max(amount, .001)
    })
  })

  return (
    <group position={position} rotation={[0, angle, 0]}>
      <Shape position={[0, 0, 0]} size={[1.02, .018, .77]} color={paper} />
      {Array.from({ length: 7 }, (_, index) => (
        <Shape key={index} position={[0, .012, -.3 + index * .1]} size={[.92, .002, .004]} color="#c3bdad" />
      ))}
      {points.slice(1).map(([x, z], index) => {
        const [startX, startZ] = points[index]
        const dx = x - startX
        const dz = z - startZ
        const length = Math.hypot(dx, dz)
        return (
          <group key={index} position={[startX, .018, startZ]}
            rotation={[0, -Math.atan2(dz, dx), 0]}
            ref={node => { strokes.current[index] = node }}>
            <Shape position={[length / 2, 0, 0]} size={[length, .006, .014]} color={ink} />
          </group>
        )
      })}
    </group>
  )
}

function positionLimb(mesh, start, end, direction) {
  direction.subVectors(end, start)
  mesh.position.copy(start).addScaledVector(direction, .5)
  mesh.scale.y = direction.length()
  mesh.quaternion.setFromUnitVectors(up, direction.normalize())
}

function Architect({ x, skin, shirt, hair, drawingProgress, reducedMotion, reviewing = false }) {
  const upper = useRef(null)
  const forearm = useRef(null)
  const hand = useRef(null)
  const pencil = useRef(null)
  const rig = useRef({
    shoulder: new Vector3(.24, .81, .1),
    elbow: new Vector3(),
    tip: new Vector3(),
    direction: new Vector3(),
  })

  useFrame(({ clock }) => {
    if (!upper.current || !forearm.current || !hand.current || !pencil.current) return
    const { shoulder, elbow, tip, direction } = rig.current
    const progress = reducedMotion.current ? drawing.length - 1
      : Math.min(clock.elapsedTime % 10 / 8, 1) * (drawing.length - 1)
    if (drawingProgress) drawingProgress.current = progress
    const index = Math.min(Math.floor(progress), drawing.length - 2)
    const [startX, startZ] = drawing[index]
    const [endX, endZ] = drawing[index + 1]
    const phase = progress - index
    const reviewMotion = reducedMotion.current ? 0 : Math.sin(clock.elapsedTime * .8) * .14
    tip.set(reviewing ? -.18 + reviewMotion : startX + (endX - startX) * phase, .233,
      .92 + (reviewing ? .1 : startZ + (endZ - startZ) * phase))
    hand.current.position.copy(tip)
    hand.current.position.y += .075
    elbow.set(.36, .37, .54)
    pencil.current.position.copy(tip)
    pencil.current.position.y += .087
    positionLimb(upper.current, shoulder, elbow, direction)
    positionLimb(forearm.current, elbow, hand.current.position, direction)
  })

  return (
    <group position={[x, 0, -1.63]}>
      <Shape position={[0, -.48, -.09]} size={[.61, .09, .54]} color="#223c74" />
      <Shape position={[0, -.86, -.1]} size={[.11, .71, .12]} color="#223c74" />
      <Shape position={[0, .36, -.04]} size={[.37, .54, .23]} kind="sphere" color={shirt} rotation={[.2, 0, 0]} />
      <Shape position={[0, .85, .09]} size={[.105, .16, .11]} kind="sphere" color={skin} />
      <Shape position={[0, 1.06, .16]} size={[.215, .25, .205]} kind="sphere" color={skin} />
      <Shape position={[0, 1.18, .1]} size={[.225, .18, .216]} kind="sphere" color={hair} />
      <Shape position={[0, 1.02, -.009]} size={[.207, .19, .09]} kind="sphere" color={hair} />
      <Shape position={[0, 1.015, .354]} size={[.042, .049, .038]} kind="sphere" color={skin} />
      {[-.075, .075].map(eye => (
        <Shape key={eye} position={[eye, 1.068, .35]} size={[.018, .016, .009]} kind="sphere" color="#263449" />
      ))}
      <Shape position={[-.27, .44, .23]} size={[.16, .65, .15]} color={shirt} rotation={[.48, 0, -.13]} />
      <Shape position={[-.3, .21, .48]} size={[.087, .069, .16]} kind="sphere" color={skin} />
      <mesh ref={upper}><cylinderGeometry args={[.108, .12, 1, 12]} /><meshToonMaterial color={shirt} /></mesh>
      <mesh ref={forearm}><cylinderGeometry args={[.068, .087, 1, 12]} /><meshToonMaterial color={skin} /></mesh>
      <mesh ref={hand} scale={[.075, .058, .083]}><sphereGeometry args={[1, 12, 8]} /><meshToonMaterial color={skin} /></mesh>
      <mesh ref={pencil}><cylinderGeometry args={[.014, .014, .18, 8]} /><meshToonMaterial color={reviewing ? '#29477c' : '#cb5338'} /></mesh>
    </group>
  )
}

export default function Architects({ reducedMotion }) {
  const progress = useRef(0)

  return (
    <>
      <Sheet position={[-1.35, .215, -.71]} angle={0} points={drawing} drawingProgress={progress} />
      <Sheet position={[1.35, .215, -.71]} angle={-.08} points={elevation} />
      <Sheet position={[1.39, .211, .57]} angle={.24} points={drawing} />
      <Architect x={-1.35} skin="#c98a6c" shirt="#2e559b" hair="#273044"
        drawingProgress={progress} reducedMotion={reducedMotion} />
      <Architect x={1.35} skin="#e1ad87" shirt="#ba5b48" hair="#543e36"
        reviewing reducedMotion={reducedMotion} />
    </>
  )
}
