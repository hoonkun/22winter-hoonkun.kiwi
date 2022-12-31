import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { DecreasedParticleScale, ParticleScaleBreakpoint } from "./particles/Particles";

const ForceFieldSize = 32
const ForceFieldSizeSmall = ForceFieldSize * DecreasedParticleScale

const ForceFieldAnimation = (size: number) => keyframes`
  from {
    transform: scaleX(-1) rotateY(20deg) translate(0, 0);
  }
  to {
    transform: scaleX(-1) rotateY(20deg) translate(-${size}px, -${size}px);
  }
`

const ForceField = styled.div`
  image-rendering: pixelated;
  background-repeat: repeat;
  background-size: ${ForceFieldSize}px ${ForceFieldSize}px;
  background-image: url("/resources/textures/background/forcefield.png");
  opacity: 0.5;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${ForceFieldAnimation(ForceFieldSize)} 6s linear infinite;

  ${ParticleScaleBreakpoint} {
    background-size: ${ForceFieldSizeSmall}px ${ForceFieldSizeSmall}px;
    animation: ${ForceFieldAnimation(ForceFieldSizeSmall)} 6s linear infinite;
  }
`

export default ForceField
