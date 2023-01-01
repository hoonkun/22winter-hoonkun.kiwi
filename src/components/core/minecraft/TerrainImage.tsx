import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const BrightnessAnimation = keyframes`
  0% {
    filter: brightness(1);
  }
  35% {
    filter: brightness(1);
  }
  36% {
    filter: brightness(1.2856);
  }
  37% {
    filter: brightness(1.407);
  }
  38% {
    filter: brightness(1.4642);
  }
  39% {
    filter: brightness(1.4856);
  }
  40% {
    filter: brightness(1.5);
  }
  90% {
    filter: brightness(1);
  }
  100% {
    filter: brightness(1);
  }
`

const TerrainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  image-rendering: pixelated;
  animation: ${BrightnessAnimation} 12s linear infinite;
`

export default TerrainImage
