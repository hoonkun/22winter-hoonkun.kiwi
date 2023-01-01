import React from "react";
import styled from "@emotion/styled";
import { Breakpoint, not, ScaleBreakpoint } from "../../../styles/globals";

import Background from "../core/minecraft/Background";
import { BackButton } from "../Buttons";

export const AsideView: React.FC = () => {
  return (
    <Root>
      <Background/>
      <Overlay>
        <AsideTitle>키위새의 아무말 집합소</AsideTitle>
        <AsideList>{["코딩", "생명과학II", "마인크래프트", "일상"].map(it => <li key={it}>{it}</li>)}</AsideList>
      </Overlay>
      <ExitButton i={"arrow_back"}/>
    </Root>
  )
}

const Root = styled.div`
  position: relative;
  
  width: 100%;
  height: 35%;
  
  min-height: 300px;

  color: white;
  
  ${Breakpoint} {
    position: fixed;
    left: 0;
    top: 0;

    min-width: 400px;
    width: 27%;
    height: 100%;
  }

  ${ScaleBreakpoint} {
    min-width: 225px;
  }
`

const Overlay = styled.div`
  position: absolute;
  z-index: 5;
  
  padding: 20px;
  
  display: flex;
  
  flex-direction: column-reverse;
  align-items: flex-end;
  
  min-height: 300px;
  right: 0;
  bottom: 0;
  
  ${Breakpoint} {
    min-height: unset;
    right: unset;
    bottom: unset;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;
  }
`

const AsideList = styled.ul`
  list-style-type: none;
  display: flex;
  margin: 0 0 5px 0;
  opacity: 0.75;
  padding-inline-start: 0;
  align-items: center;

  ${Breakpoint} {
    font-size: 15px;
  }

  & > li {
    display: flex;
    align-items: center;
  }

  & > li:nth-of-type(n+2):before {
    content: "/";
    margin: 0 5px;
    opacity: 0.5;
    font-size: 10px;
    display: block;
  }
`

const AsideTitle = styled.div`
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  line-height: 125%;
  word-break: keep-all;
  
  ${not(Breakpoint)} {
    font-size: 28px;
  }
`

const ExitButton = styled(BackButton)`
  position: absolute;
  left: 20px;
  top: 20px;
`

export default AsideView
