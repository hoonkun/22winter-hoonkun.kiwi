import React, { useCallback, useEffect, useRef } from "react";
import { ParticleImg } from "./Particles";
import { useRatioPosition } from "../useRatioPosition";
import styled from "@emotion/styled";
import TerrainImage from "../TerrainImage";
import { Times } from "../../../../utils/Times";
import { Random } from "../../../../utils/KTN";

const DrippingWaterAnimationDuration = 6000

const DrippingWaterParticle: React.FC<{ dimension: [width: number, height: number], position: [x: number, y: number] }> = ({ dimension, position }) => {
  const [x, y] = useRatioPosition({ width: dimension[0], height: dimension[1], x: position[0], y: position[1] })

  const particleRef = useRef<HTMLImageElement>(null)
  const time = useRef(Times())

  const animating = useRef(false)

  const loop = useCallback(async () => {
    if (animating.current || !particleRef.current) return
    if (!Random.possible(0.3)) return
    animating.current = true

    particleRef.current.style.opacity = "0"
    particleRef.current.animate([
      { transform: "translateY(0) scale(0.75)", offset: 0 },
      { transform: "translateY(0) scale(1)", offset: 0.6666, easing: "cubic-bezier(0.12, 0, 0.39, 0)" },
      { transform: "translateY(100vh) scale(1)", offset: 1, easing: "cubic-bezier(0.12, 0, 0.39, 0)" },
    ], { duration: DrippingWaterAnimationDuration, fill: "forwards" })
    await time.current.sleep(100)
    particleRef.current.style.opacity = "1"
    await time.current.sleep(DrippingWaterAnimationDuration)
    particleRef.current.style.opacity = "0"
    await time.current.sleep(Random.range(4000, 6000))

    animating.current = false
  }, [])

  useEffect(() => {
    const looper = setInterval(loop, 300);
    return () => clearInterval(looper)
  }, [loop])

  return (
    <>
      <DrippingWaterImage
        ref={particleRef}
        src={"/resources/textures/background/drip_water_fall.png"}
        style={{top: `${y}%`, left: `${x}%`, opacity: 0}}
        className={"particle-scale"}
      />
      <TerrainImage src={"/resources/textures/background/bg_outer_water_drip_overlay.png"} alt={""}/>
    </>
  )
}

const DrippingWaterImage = styled(ParticleImg)`
  transform-origin: left top;
  width: 25px;
  height: 25px;
  filter: brightness(0.85);
`;

export default DrippingWaterParticle
