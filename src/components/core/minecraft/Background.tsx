import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import ForceField from "./ForceField";
import TerrainImage from "./TerrainImage";
import FlameParticles from "./particles/FlameParticle";
import SmokeParticles from "./particles/SmokeParticle";
import DrippingLavaParticles from "./particles/DrippingLavaParticle";
import DrippingWaterParticle from "./particles/DrippingWaterParticle";
import { ParticleScaleBreakpoint } from "./particles/Particles";
import { css, Global } from "@emotion/react";
import { SplashView } from "../../SplashView";
import { Breakpoint, not } from "../../../../styles/globals";
import { Times } from "../../../utils/Times";

const BgWidth = 2560
const BgHeight = 1600

const Background: React.FC = () => {

  const root = useRef<HTMLDivElement>(null)
  const [dimension, setDimension] = useState<[number, number]>([0, 0])

  const [enabled, setEnabled] = useState(false)

  const [ready, setReady] = useState(false)

  useEffect(() => {
    const CurrentRoot = root.current
    if (!CurrentRoot) return;

    const handler = () => setDimension([CurrentRoot.clientWidth, CurrentRoot.clientHeight])
    handler()

    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  useEffect(() => {
    Times()
      .until(new Image().also(it => it.src = "/resources/textures/background/bg_inner.png"), "load")
      .then(() => setReady(true))
  }, [])

  useEffect(() => {
    const webkit = navigator.userAgent.includes("AppleWebKit")
    const chrome = navigator.userAgent.includes("CriOS")

    if (!webkit || !chrome) setEnabled(true)
  }, [])

  return (
    <BackgroundRoot ref={root}>
      <Global styles={css`${ParticleScaleBreakpoint} { .particle-scale { scale: 30%; } .particle-position { translate: -35% -35%; } }`}/>
      <Container>
        <TerrainImage src={"/resources/textures/background/bg_outer.png"} alt={""}/>
        {enabled && <Hack><ForceField/></Hack>}
        <TerrainImage src={"/resources/textures/background/bg_inner.png"} alt={""}/>
        {enabled &&
          <>
            <DrippingWaterParticle position={[1130 / BgWidth, 488 / BgHeight]} dimension={dimension}/>
            <FlameParticles position={[1125 / BgWidth, 880 / BgHeight]} dimension={dimension}/>
            <SmokeParticles position={[1125 / BgWidth, 880 / BgHeight]} dimension={dimension}/>
            <DrippingLavaParticles position={[1510 / BgWidth, 1037 / BgHeight]} type={"big"} intervalOffset={25} dimension={dimension}/>
          </>
        }
      </Container>
      <BackgroundSplash active={!ready}/>
    </BackgroundRoot>
  )
}

const BackgroundRoot = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  ${not(Breakpoint)} {
    z-index: 0;
  }
`

const Container = styled.div`
  position: absolute;
  width: calc(100% + 5px);
  height: calc(100% + 5px);
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 5000px;
  
  ${ParticleScaleBreakpoint} {
    transform: translate3d(-50%, -50%, 0) scale(2);
  }
`

const Hack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translate3d(0, 0, 0);
  top: 0;
  left: 0;
  z-index: 0;
`

const BackgroundSplash = styled(SplashView)`
  position: absolute;
`

export default Background
