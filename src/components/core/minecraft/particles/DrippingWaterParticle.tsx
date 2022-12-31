import React, { useCallback, useEffect, useRef, useState } from "react";
import { DecreasedParticleScale, ParticleImg, ParticleScaleBreakpoint } from "./Particles";
import { useRatioPosition } from "../useRatioPosition";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import TerrainImage from "../TerrainImage";
import { Random } from "../../../../utils/KTN";

const DrippingWaterAnimationDuration = 6

const DrippingWaterParticle: React.FC<{ dimension: [width: number, height: number], position: [x: number, y: number] }> = ({ dimension, position }) => {
  const [x, y] = useRatioPosition({ width: dimension[0], height: dimension[1], x: position[0], y: position[1] })

  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(true)

  const imageRef = useRef<HTMLImageElement>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const cycling = useRef(false);

  const validateImageRef = useCallback(() => {
    const image = imageRef.current
    if (!image) {
      cycling.current = false
      return null
    } else {
      return image
    }
  }, [])

  const waitForDelay = useCallback(() => {
    const image = validateImageRef()
    if (!image) return

    cycling.current = false
  }, [validateImageRef])

  const waitForAnimationFinish = useCallback(() => {
    const image = validateImageRef()
    if (!image) return

    setVisible(false)
    image.style.animation = "none"

    timeout.current = setTimeout(waitForDelay, Random.range(80, 160) * 100)
  }, [validateImageRef, waitForDelay])

  const doAnimationCycle = useCallback(async () => {
    if (cycling.current) return

    cycling.current = true

    const image = validateImageRef()
    if (!image) return

    setVisible(true)
    image.style.removeProperty("animation")

    timeout.current = setTimeout(waitForAnimationFinish, 6000)
  }, [validateImageRef, waitForAnimationFinish])

  useEffect(() => {
    const t = setTimeout(() => setActive(true), Random.range(4, 10) * 1000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    return () => { if (timeout.current) clearTimeout(timeout.current) }
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      if (cycling.current) return
      doAnimationCycle().then()
    }, 1000)
    return () => clearInterval(i)
  }, [doAnimationCycle])

  return (
    <>
      { active &&
        <DrippingWaterImage
          ref={imageRef}
          src={"/resources/textures/background/drip_water_fall.png"}
          style={{top: y, left: x, animation: "none", opacity: visible ? 1 : 0}}
        />
      }
      <TerrainImage src={"/resources/textures/background/bg_outer_water_drip_overlay.png"} alt={""}/>
    </>
  )
}

const DrippingWaterAnimation = (size?: number) => keyframes`
  0% { transform: translateY(0) scale(${(size ?? 1) * 0.75}) }
  66.666% { transform: translateY(0) scale(${size ?? 1}) }
  100% { transform: translateY(100vh) scale(${size ?? 1}) }
`

const DrippingWaterImage = styled(ParticleImg)`
  animation-name: ${DrippingWaterAnimation()};
  animation-duration: ${DrippingWaterAnimationDuration}s;
  animation-timing-function: cubic-bezier(0.12, 0, 0.39, 0);
  transform-origin: left top;
  width: 25px;
  height: 25px;
  filter: brightness(0.85);
  
  ${ParticleScaleBreakpoint} {
    animation-name: ${DrippingWaterAnimation(DecreasedParticleScale)};
  }
`;

export default DrippingWaterParticle
