import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Particles, {
  DecreasedParticleScale,
  Particle,
  ParticleGenerator,
  ParticleImg,
  ParticleProps, ParticleScaleBreakpoint,
  ParticlesWrapperProps
} from "./Particles";

const ParticleDurations = [1000, 2000, 2000, 2000, 4000, 5000] as const
const ParticleYOffsets = [-2, -1, 0, 1, 2] as const
const ParticleXOffsets = [-1, 0, 1] as const
const ParticleSizes = [10, 15, 15] as const

interface FlameParticleType extends Particle { }

const FlameGenerator: ParticleGenerator<FlameParticleType> = () => ({
  created_at: new Date().valueOf(),
  duration: ParticleDurations.random(),
  offset: { x: ParticleXOffsets.random(), y: ParticleYOffsets.random() },
  size: ParticleSizes.random().let(it => ({ width: it, height: it })),
})

const FlameParticle: React.FC<ParticleProps<FlameParticleType>> = ({ particle, style }) => {
  return (
    <FlameParticleImg
      style={{ ...style, animationDuration: `${particle.duration}ms`, animationTimingFunction: `cubic-bezier(0.55, 0, 1, 0.45)`, animationFillMode: `forwards` }}
      src={"/resources/textures/background/flame.png"}
    />
  )
}

const FlameAnimation = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); }
  15% { transform: translate(-50%, -50%) scale(0.925); }
  100% { transform: translate(-50%, -50%) scale(0); }
`

const ScaledFlameAnimation = keyframes`
  0% { transform: translate(-50%, -50%) scale(${DecreasedParticleScale}) }
  15% { transform: translate(-50%, -50%) scale(${DecreasedParticleScale * 0.925}) }
  100% { transform: translate(-50%, -50%) scale(0) }
`

const FlameParticleImg = styled(ParticleImg)`
  transform-origin: center center;
  animation-name: ${FlameAnimation};
  
  ${ParticleScaleBreakpoint} {
    animation-name: ${ScaledFlameAnimation};
  }
`

const FlameParticles: React.FC<ParticlesWrapperProps> = (props) => {
  return (
    <Particles
      generator={FlameGenerator}
      intervals={{ emitter: 600, limiter: 100 }}
      possibilities={{ emitter: 0.125 }}
      component={FlameParticle}
      {...props}
    />
  )
}

export default FlameParticles
