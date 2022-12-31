import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import ForceField from "./ForceField";
import TerrainImage from "./TerrainImage";
import FlameParticles from "./particles/FlameParticle";
import SmokeParticles from "./particles/SmokeParticle";
import DrippingLavaParticles from "./particles/DrippingLavaParticle";
import DrippingWaterParticle from "./particles/DrippingWaterParticle";
import { ParticleScaleBreakpoint } from "./particles/Particles";

const BgWidth = 2560
const BgHeight = 1600

const Background: React.FC = () => {

  const root = useRef<HTMLDivElement>(null)
  const [dimension, setDimension] = useState<[number, number]>([0, 0])

  useEffect(() => {
    const CurrentRoot = root.current
    if (!CurrentRoot) return;

    const handler = () => setDimension([CurrentRoot.clientWidth, CurrentRoot.clientHeight])
    handler()

    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  return (
    <BackgroundRoot ref={root}>
      <Container>
        <TerrainImage src={"/resources/textures/background/bg_outer.png"} alt={""}/>
        <Hack><ForceField/></Hack>
        <TerrainImage src={"/resources/textures/background/bg_inner.png"} alt={""}/>
        <DrippingWaterParticle position={[1130 / BgWidth, 488 / BgHeight]} dimension={dimension}/>
        <FlameParticles position={[1125 / BgWidth, 880 / BgHeight]} dimension={dimension}/>
        <SmokeParticles position={[1125 / BgWidth, 880 / BgHeight]} dimension={dimension}/>
        <DrippingLavaParticles position={[1695 / BgWidth, 1229 / BgHeight]} type={"big"} intervalOffset={25} dimension={dimension}/>
        <DrippingLavaParticles position={[2172 / BgWidth, 1017 / BgHeight]} type={"small"} intervalOffset={78} dimension={dimension}/>
      </Container>
    </BackgroundRoot>
  )
}

const BackgroundRoot = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
    transform: translate3d(-50%, -50%, 0) scale(1.5);
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

export default Background
