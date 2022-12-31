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

const ParticleXOffsets = [-2, -1, 0, 1, 2] as const
const ParticleYOffsets = [-2, -1, 0, 1, 2] as const
const ParticleSizes = [10, 10, 8, 8, 8, 12, 15] as const
const ParticleDurations = [2000, 4250, 4500, 4750, 5000] as const
const ParticleDistances = [1, 1.5, 2, 2, 2, 2.5, 3]
const ParticleStartsFrom = [5, 6, 7] as const

interface SmokeParticle extends Particle {
  distance: number
  startsFrom: number
}

const SmokeGenerator: ParticleGenerator<SmokeParticle> = () => ({
  created_at: new Date().valueOf(),
  duration: ParticleDurations.random(),
  distance: ParticleDistances.random(),
  offset: { x: ParticleXOffsets.random(), y: ParticleYOffsets.random() },
  size: ParticleSizes.random().let(it => ({ width: it, height: it })),
  startsFrom: ParticleStartsFrom.random()
})

const SmokeParticle: React.FC<ParticleProps<SmokeParticle>> = ({ particle, style }) => {
  const [image, setImage] = useState(particle.startsFrom)

  useEffect(() => {
    const i = setInterval(() => {
      setImage(prevState => prevState === 0 ? 0 : prevState - 1)
    }, particle.duration / (particle.startsFrom + 1));
    return () => clearInterval(i)
  }, [particle.duration, particle.startsFrom])

  return (
    <SmokeParticleImage
      style={{ ...style, animationDuration: `${particle.duration}ms`, animationFillMode: `forwards` }}
      distance={particle.distance}
      src={`/resources/textures/background/generic_${image}.png`}
    />
  )
}

const SmokeAnimations = ParticleDistances.distinct().associate(it => keyframes`
  from { transform: translate(-50%, -50%); }
  to { transform: translate(-50%, calc(-50% - ${it * 100}%)); }
`)

const DecreasedSmokeAnimations = ParticleDistances.distinct().associate(it => keyframes`
  from { transform: translate(-50%, -50%) scale(${DecreasedParticleScale}); }
  to { transform: translate(-50%, calc(-50% - ${it * 100 * DecreasedParticleScale}%)) scale(${DecreasedParticleScale}); }
`)

const SmokeParticleImage = styled(ParticleImg)<{ distance: number }>`
  filter: brightness(0);
  animation-name: ${({ distance }) => SmokeAnimations.get(distance)!};
  transform-origin: center center;
  
  ${ParticleScaleBreakpoint} {
    animation-name: ${({ distance }) => DecreasedSmokeAnimations.get(distance)!}
  }
`

const SmokeParticles: React.FC<ParticlesWrapperProps> = (props) => {
  return (
    <Particles
      generator={SmokeGenerator}
      intervals={{ emitter: 200, limiter: 100 }}
      possibilities={{ emitter: 0.075 }}
      component={SmokeParticle}
      {...props}
    />
  )
}

export default SmokeParticles
