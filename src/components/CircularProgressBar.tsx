import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

type CircularProgressBarProps = {
  size: number
  className?: string
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ className, ...props }) => {
  return (
    <ProgressBarRoot className={className} { ...props }>
      <ProgressBarRail { ...props } />
      <ProgressBarIndicator { ...props } />
    </ProgressBarRoot>
  )
}

const ProgressBarRoot = styled.div<CircularProgressBarProps>`
  width: ${({ size }) => size}rem;
  height: ${({ size }) => size}rem;
  position: relative;
  transform: scale(0.85);
`

const ProgressBarRail = styled.div<CircularProgressBarProps>`
  width: ${({ size }) => size}rem;
  height: ${({ size }) => size}rem;
  border-radius: 50%;
  border-style: solid;
  border-width: 1rem;
  border-color: var(--text-color-primary);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.925);
  opacity: 0.45;
`

const ProgressBarAnimation = keyframes`
  from {
    transform: translate(-50%, -50%) scale(1) rotateZ(0deg);
  }
  to {
    transform: translate(-50%, -50%) scale(1) rotateZ(360deg);
  }
`

const ProgressBarIndicator = styled(ProgressBarRail)`
  border-width: 3rem;
  clip-path: polygon(0 0, 50% 50%, 100% 0);
  animation: ${ProgressBarAnimation} 0.8562s linear infinite;
  transform-origin: 50% 50%;
  opacity: 1;
`

export default CircularProgressBar
