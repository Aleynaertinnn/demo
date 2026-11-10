import Box from './Box'
import CameraRig from './CameraRig'
import DaylightScene from './DaylightScene'
import Room from './Room'
import DeskDetails from './DeskDetails'
import FinaleSheet from './FinaleSheet'
import Furniture from './Furniture'
import ArchitectureModel from './ArchitectureModel'
import DraftingSheets, { ProjectSketch } from './DraftingSheets'
import { IllustrationMaterial } from '../materials/illustration'

const paper = '#eeecdf'
const white = '#faf8ed'

export default function AtelierScene({ motion }) {
  return (
    <>
      <CameraRig motion={motion} />
      <DaylightScene motion={motion} />
      <Room motion={motion} />
      <DeskDetails />
      <FinaleSheet motion={motion} />
      <Furniture />
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
