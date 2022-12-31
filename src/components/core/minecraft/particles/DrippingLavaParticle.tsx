import React, { useEffect, useState } from "react";
import Particles, {
  DecreasedParticleScale,
  Particle,
  ParticleGenerator,
  ParticleImg,
  ParticleProps, ParticleScaleBreakpoint,
  ParticlesWrapperProps
} from "./Particles";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Random } from "../../../../utils/KTN";

const DrippingLavaParticleSizes = {
  "big": 35,
  "small": 20
}

interface DrippingLavaParticleType extends Particle {
  brightness: number
  type: "big" | "small"
}

const DrippingLavaGenerator: ParticleGenerator<DrippingLavaParticleType> = (type: "big" | "small") => ({
  created_at: new Date().valueOf(),
  duration: 4000,
  offset: type === "big" ?
    { x: Random.range(-25, 25), y: Random.range(-15, 15) } :
    { x: Random.range(-10, 10), y: Random.range(-6, 6) },
  brightness: [1, 1, 1, 1.5, 1.5, 1.8, 1.8].random(),
  type: type,
  size: DrippingLavaParticleSizes[type].let(it => ({ width: it, height: it }))
})

const DrippingLavaParticle: React.FC<ParticleProps<DrippingLavaParticleType>> = ({ particle, style }) => {
  const [drippingState, setDrippingState] = useState<"fall" | "land">("fall")
  const [initialWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    const t = setTimeout(() => setDrippingState("land"), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <DrippingLavaParticleImage
      style={{
        ...style,
        animationDuration: `1000ms`,
        animationFillMode: `forwards`,
        animationTimingFunction: `cubic-bezier(0.12, 0, 0.39, 0)`,
        filter: `brightness(${particle.brightness})`
      }}
      windowHeight={initialWindowHeight}
      src={`/resources/textures/background/drip_${drippingState}.png`}
    />
  )
}

const DrippingLavaParticleAnimation = (size?: number) => keyframes`
  from { transform: translateY(-100vh) scale(${size ?? 1}); }
  to { transform: translateY(0) scale(${size ?? 1}); }
`

const DrippingLavaParticleImage = styled(ParticleImg)<{ windowHeight: number }>`
  animation-name: ${DrippingLavaParticleAnimation()};
  ${ParticleScaleBreakpoint} {
    animation-name: ${DrippingLavaParticleAnimation(DecreasedParticleScale)};
  }
`

const DrippingLavaParticles: React.FC<ParticlesWrapperProps & { type: "big" | "small", intervalOffset: number }> = ({ position, dimension, type, intervalOffset }) => {
  return (
    <Particles
      generator={() => DrippingLavaGenerator(type)}
      intervals={{ emitter: 400 + intervalOffset, limiter: 200 }}
      possibilities={{ emitter: 0.035 }}
      component={DrippingLavaParticle}
      position={position}
      dimension={dimension}
    />
  )
}

export default DrippingLavaParticles
