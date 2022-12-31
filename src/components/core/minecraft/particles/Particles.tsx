import React, { useState, useCallback, useEffect, useRef, CSSProperties } from "react";
import styled from "@emotion/styled";
import { useRatioPosition } from "../useRatioPosition";
import { Random } from "../../../../utils/KTN";

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
  intervals: {
    emitter: number
    limiter: number
  }
  possibilities: {
    emitter: number
  }
  component: React.FC<ParticleProps<T>>
  position: [number, number]
  dimension: [number, number]
}

function Particles<T extends Particle>({
    generator: generator,
    intervals: { emitter: emittingInterval, limiter: limitingInterval },
    possibilities: { emitter: emitPossibility },
    component: ParticleComponent,
    dimension: [width, height],
    position: [ratioX, ratioY]
}: ParticlesProps<T>) {
  const [particles, setParticles] = useState<T[]>([])
  const [x, y] = useRatioPosition({ width, height, x: ratioX, y: ratioY })

  const generatorLoop = useRef<NodeJS.Timeout | null>(null)
  const limiterLoop = useRef<NodeJS.Timeout | null>(null)

  const emitter = useCallback(() => {
    if (!Random.possible(emitPossibility)) return;

    setParticles(prevState => {
      if (prevState.length > 2) return prevState;
      return [...prevState, generator()]
    })
  }, [generator, emitPossibility])

  const limiter = useCallback(() => {
    const now = new Date().valueOf();
    setParticles(prevState => {
      const inAliveState = prevState.filter(it => it.created_at + it.duration > now)
      if (inAliveState.length === prevState.length) return prevState
      return inAliveState
    });
  }, []);

  useEffect(() => {
    generatorLoop.current = setInterval(emitter, emittingInterval)
    limiterLoop.current = setInterval(limiter, limitingInterval)

    return () => {
      if (generatorLoop.current) clearInterval(generatorLoop.current)
      if (limiterLoop.current) clearInterval(limiterLoop.current)
    }
  }, [emitter, limiter, emittingInterval, limitingInterval])

  return (
    <ParticlesRoot>
      { particles.map(it =>
        <ParticleComponent
          key={`fp_${it.created_at}`}
          particle={it}
          style={{ width: it.size.width, height: it.size.height, left: x + it.offset.x, top: y + it.offset.y }}
        />
      ) }
    </ParticlesRoot>
  )
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
  animation-delay: 0.01s;
`

export default Particles;
