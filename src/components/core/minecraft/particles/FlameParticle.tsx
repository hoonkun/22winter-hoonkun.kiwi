import React, { useCallback } from "react";
import Particles, {
  Particle,
  ParticleGenerator,
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

const FlameParticles: React.FC<ParticlesWrapperProps> = (props) => {

  const factory = useCallback((particle: FlameParticleType) => {
    const element = document.createElement("img")

    element.src = "/resources/textures/background/flame.png"

    const frames: Keyframe[] = [
      { transform: "translate(-50%, -50%) scale(1)", offset: 0 },
      { transform: "translate(-50%, -50%) scale(0.925)", offset: 0.15 },
      { transform: "translate(-50%, -50%) scale(0)", offset: 1 }
    ]
    element.animate(frames, { easing: "cubic-bezier(0.55, 0, 1, 0.45)", duration: particle.duration, fill: "forwards" })

    return element
  }, [])

  return (
    <Particles
      generator={FlameGenerator}
      intervals={{ emitter: 600 }}
      possibilities={{ emitter: 0.125 }}
      factory={factory}
      {...props}
    />
  )
}

export default FlameParticles
