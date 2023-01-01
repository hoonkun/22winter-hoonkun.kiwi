import React, { useCallback, useEffect, useRef, CSSProperties } from "react";
import styled from "@emotion/styled";
import { useRatioPosition } from "../useRatioPosition";
import { Random } from "../../../../utils/KTN";
import { Times, TimesSkeleton } from "../../../../utils/Times";

export interface Particle {
  created_at: number
  duration: number
  size: ParticleSize
  offset: ParticlePosition
}

export type ParticleProps<T extends Particle> = {
  particle: T
  style?: CSSProperties
}

export type ParticlePosition = { x: number, y: number }
export type ParticleSize = { width: number, height: number }

export type ParticleGenerator<T extends Particle> = (...args: any[]) => T

export type ParticlesWrapperProps = { position: [number, number], dimension: [number, number] }

export const ParticleScaleBreakpoint = `@media only screen and (max-width: 840px)`
export const DecreasedParticleScale = 0.35

type ParticlesProps<T extends Particle> = {
  generator: () => T
  intervals: { emitter: number }
  possibilities: { emitter: number }
  position: [number, number]
  dimension: [number, number]
  factory: (particle: T) => HTMLElement
}

function Particles<T extends Particle>({
    generator: generator,
    intervals: { emitter: emittingInterval },
    possibilities: { emitter: emitPossibility },
    dimension: [width, height],
    position: [ratioX, ratioY],
    factory
}: ParticlesProps<T>) {
  const [x, y] = useRatioPosition({ width, height, x: ratioX, y: ratioY })

  const root = useRef<HTMLDivElement>(null)
  const { current: time } = useRef<TimesSkeleton>(Times())

  const loop = useCallback(async () => {
    if (!root.current) return;
    if (!Random.possible(emitPossibility)) return;

    const particle = generator()
    const element = factory(particle)

    let offsetScale = 1
    if (typeof window !== "undefined" && window.innerWidth < 840) offsetScale = 0.3

    element.style.outline = "none"

    element.style.width = `${particle.size.width}px`
    element.style.height = `${particle.size.height}px`
    element.style.left = `calc(${x}% + ${particle.offset.x * offsetScale}px)`
    element.style.top = `calc(${y}% + ${particle.offset.y * offsetScale}px)`

    element.style.position = "absolute"
    element.style.imageRendering = "pixelated"

    element.classList.add("particle-scale")
    element.classList.add("particle-position")

    root.current.appendChild(element)
    element.style.opacity = "0"
    time.sleep(100).then(wake => wake && (element.style.opacity = "1"))
    if (!await time.sleep(particle.duration)) return
    element.remove()
  }, [factory, emitPossibility, generator, time, x, y])

  useEffect(() => {
    const interval = setInterval(loop, emittingInterval)
    return () => clearInterval(interval)
  }, [emittingInterval, loop])

  return <ParticlesRoot ref={root}/>
}

const ParticlesRoot = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

export const ParticleImg = styled.img`
  position: absolute;
  image-rendering: pixelated;
`

export default Particles;
