import React, { useCallback } from "react";
import Particles, {
  Particle,
  ParticleGenerator,
  ParticlesWrapperProps
} from "./Particles";
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

const DrippingLavaParticles: React.FC<ParticlesWrapperProps & { type: "big" | "small", intervalOffset: number }> = ({ position, dimension, type, intervalOffset }) => {

  const factory = useCallback((particle: DrippingLavaParticleType) => {
    const element = document.createElement("img")
    element.style.filter = `brightness(${particle.brightness})`

    element.src = `/resources/textures/background/drip_fall.png`
    setTimeout(() => element.src = `/resources/textures/background/drip_land.png`, 1000)

    const frames: Keyframe[] = [
      { transform: "translateY(-100vh) scale(1)" },
      { transform: "translateY(0) scale(1)" }
    ]
    element.animate(frames, { duration: 1000, fill: "forwards", easing: "cubic-bezier(0.12, 0, 0.39, 0)" })

    return element
  }, [])

  return (
    <Particles
      generator={() => DrippingLavaGenerator(type)}
      intervals={{ emitter: 400 + intervalOffset }}
      possibilities={{ emitter: 0.035 }}
      factory={factory}
      position={position}
      dimension={dimension}
    />
  )
}

export default DrippingLavaParticles
