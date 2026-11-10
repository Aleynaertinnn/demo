import { useEffect, useMemo } from 'react'
import { BoxGeometry, EdgesGeometry } from 'three'
import { IllustrationMaterial } from '../materials/illustration'

export default function Box({ position, size, color, rotation, outline = Math.min(...size) > .02, castShadow = false, contour = '#4b6792', paperSurface = false, inkStrength = .5 }) {
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
