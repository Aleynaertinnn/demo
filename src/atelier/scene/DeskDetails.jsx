import Box from './Box'
import { IllustrationMaterial } from '../materials/illustration'

export default function DeskDetails() {
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
