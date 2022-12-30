import React from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

export const SplashView: React.FC<{ active: boolean, translucent?: boolean }> = ({ active, translucent }) => {
  return (
    <Splash active={active} translucent={translucent ?? false}>
      <LoadingParent><div/></LoadingParent>
    </Splash>
  )
}

const Splash = styled.div<{ active: boolean, translucent: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  
  transition: background-color 0.35s linear 0.05s;
  
  ${({ active, translucent }) => active ? css`
    background-color: ${translucent ? "#000000A0" : "black"};
    pointer-events: auto;
    
    & > div {
      background-color: #ffffff40;
      & > div {
        background-color: white;
      }
    }
  ` : css`
    background-color: transparent;
    pointer-events: none;

    & > div {
      background-color: transparent;
      & > div {
        background-color: transparent;
      }
    }
  `}
`

const LoadingAnimation = keyframes`
  0% {
    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
  }
  50% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  }
`

const LoadingParent = styled.div`
  width: 2px;
  height: 100px;
  background-color: #ffffff40;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  transition: background-color 0.6s linear;
  
  & > div {
    background-color: white;
    width: 100%;
    height: 100%;

    transition: background-color 0.6s linear;
    
    animation: ${LoadingAnimation} 0.45s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
`
