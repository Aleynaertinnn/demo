import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const paper = '#f9efd8'
const ink = '#8b2920'
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

function Shape({ position, size, color }) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshToonMaterial color={color} />
    </mesh>
  )
}

function Sheet({ position, angle, points }) {
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
            rotation={[0, -Math.atan2(dz, dx), 0]}>
            <Shape position={[length / 2, 0, 0]} size={[length, .006, .014]} color={ink} />
          </group>
        )
      })}
    </group>
  )
}

export default function DraftingSheets() {
  return (
    <>
      <Sheet position={[-1.35, .215, -.71]} angle={0} points={drawing} />
      <Sheet position={[1.35, .215, -.71]} angle={-.08} points={elevation} />
      <Sheet position={[1.39, .211, .57]} angle={.24} points={drawing} />
    </>
  )
}

const projectLines = [
  [[-.675, -.61], [.975, -.61]],
  [[.975, -.61], [.975, .63]],
  [[.975, .63], [-.675, .63]],
  [[-.675, .63], [-.675, -.61]],
  [[.15, -.61], [.15, -.18]],
  [[.15, .07], [.15, .63]],
  [[-.675, .07], [-.26, .07]],
  [[-.04, .07], [.15, .07]],
  [[.15, .27], [.56, .27]],
  [[.77, .27], [.975, .27]],
  [[.56, .27], [.56, .63]],
]

export function ProjectSketch({ motion }) {
  const strokes = useRef([])

  useFrame(() => {
    strokes.current.forEach((stroke, index) => {
      if (!stroke) return
      const visibleLength = Math.min(1, Math.max(0, motion.current.sketch * projectLines.length - index))
      stroke.visible = visibleLength > 0
      stroke.scale.x = Math.max(.001, visibleLength)
    })
  })

  return (
    <group>
      {projectLines.map(([[startX, startZ], [x, z]], index) => {
        const dx = x - startX
        const dz = z - startZ
        const length = Math.hypot(dx, dz)

        return (
          <group key={index} position={[startX, .203, startZ]} rotation={[0, -Math.atan2(dz, dx), 0]}>
            <Shape position={[length / 2, 0, 0]} size={[length, .003, .005]} color="#b98a74" />
            <group visible={false} ref={node => { strokes.current[index] = node }}>
              <Shape position={[length / 2, .003, 0]} size={[length, .004, index < 4 ? .017 : .011]} color={ink} />
            </group>
          </group>
        )
      })}
    </group>
  )
}
