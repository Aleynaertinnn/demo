import { createContext, useContext, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { dayState } from '../animation/day-cycle.mjs'
import { DataTexture, NearestFilter, RedFormat, UnsignedByteType } from 'three'

const RampContext = createContext(null)
const NightContext = createContext(null)
export function useNightUniform() { return useContext(NightContext) }

// Shared by JSX surfaces and loaded GLB furniture, so shadows use the same blue ink.
export function blueIllustration(material) {
  material.onBeforeCompile = shader => {
    shader.uniforms.nightFactor = material.userData.nightUniform || { value: 0 }
    shader.uniforms.inkStrength = { value: material.userData.inkStrength ?? 1 }
    shader.fragmentShader = 'uniform float inkStrength; uniform float nightFactor;\n' + shader.fragmentShader
    shader.fragmentShader = shader.fragmentShader.replace(
      'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
      `float surfaceValue = max(dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)), 0.015);
      float daylight = dot(reflectedLight.directDiffuse, vec3(0.2126, 0.7152, 0.0722)) / surfaceValue;
      float lit = smoothstep(0.025, 0.36, daylight);
      vec3 blueInk = vec3(0.009, 0.044, 0.48) * (0.3 + 0.7 * surfaceValue);
      blueInk = mix(diffuseColor.rgb, blueInk, inkStrength);
      vec3 outgoingLight = mix(blueInk, diffuseColor.rgb, lit) * mix(vec3(1.0), vec3(0.12,0.18,0.36),nightFactor) + reflectedLight.directDiffuse * nightFactor * 0.7 + totalEmissiveRadiance;`
    )
  }
  material.customProgramCacheKey = () => 'atelier-blue-ink-v2'
}

// Three discrete light values keep the room closer to a printed illustration.
export function IllustrationPalette({ children, motion }) {
  const night = useMemo(()=>({value:0}),[])
  useFrame(()=>{night.value=dayState(motion?.current.day||0).night})
  const ramp = useMemo(() => {
    const texture = new DataTexture(new Uint8Array([95, 175, 255]), 3, 1, RedFormat, UnsignedByteType)
    texture.minFilter = NearestFilter
    texture.magFilter = NearestFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true
    return texture
  }, [])
  useEffect(() => () => ramp.dispose(), [ramp])
  return <NightContext.Provider value={night}><RampContext.Provider value={ramp}>{children}</RampContext.Provider></NightContext.Provider>
}

export function useIllustrationRamp() {
  return useContext(RampContext)
}

export function IllustrationMaterial({ color, ...props }) {
  const ramp = useContext(RampContext)
  const night = useNightUniform()
  return <meshToonMaterial color={color} gradientMap={ramp} onUpdate={material=>{material.userData.nightUniform=night;blueIllustration(material)}} {...props} />
}
