import Box from './Box'
import Window from './Window'
import CityView from './CityView'
import WallSheets from './WallSheets'
import { atelierLayout } from '../config/layout.mjs'

export default function Room({motion}) {
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
    <Window />
    <CityView motion={motion} />
    <WallSheets />
  </group>
}
