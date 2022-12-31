import React, { useCallback } from "react";
import Particles, {
  Particle,
  ParticleGenerator,
  ParticlesWrapperProps
} from "./Particles";

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

const SmokeParticles: React.FC<ParticlesWrapperProps> = (props) => {

  const factory = useCallback((particle: SmokeParticle) => {
    // 기본 셋업
    const element = document.createElement("img")
    element.style.filter = "brightness(0)"

    // 시간 경과에 따른 파티클 이미지 변경
    let iteration = particle.startsFrom
    element.src = `/resources/textures/background/generic_${iteration}.png`
    const interval: NodeJS.Timeout = setInterval(() => {
      iteration--
      if (iteration === 0) return clearInterval(interval)
      element.src = `/resources/textures/background/generic_${iteration}.png`
    }, particle.duration / (particle.startsFrom + 1))

    // 애니메이션
    const frames: Keyframe[] = [
      { transform: "translate(-50%, -50%)" },
      { transform: `translate(-50%, calc(-50% - ${particle.distance * 100}%))` }
    ]
    element.animate(frames, { easing: "linear", duration: particle.duration, fill: "forwards" })

    // 리턴
    return element
  }, [])

  return (
    <Particles
      generator={SmokeGenerator}
      intervals={{ emitter: 200 }}
      possibilities={{ emitter: 0.075 }}
      factory={factory}
      {...props}
    />
  )
}

export default SmokeParticles
