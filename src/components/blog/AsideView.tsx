import React from "react";
import styled from "@emotion/styled";
import { Breakpoint, ScaleBreakpoint } from "../../../styles/globals";

import ProfilePhotoResource from "./../../resources/images/profile_photo.jpg"
import HighlightedLink from "../HighlightedLink";
import Background from "../core/minecraft/Background";

export const AsideView: React.FC = () => {
  return (
    <Root>
      <Background/>
      <Overlay>
        <AsidePhoto src={ProfilePhotoResource.src}/>
        <AsideTitle>키위새의 아무말 집합소</AsideTitle>
        <AsideList>{["코딩", "생명과학II", "마인크래프트", "일상"].map(it => <li key={it}>{it}</li>)}</AsideList>
        <RootPageLink href={"/"} color={"#689f38"}>hoonkun.kiwi</RootPageLink>
      </Overlay>
    </Root>
  )
}

const Root = styled.div`
  position: relative;
  
  width: 100%;
  height: 35%;
  
  min-height: 300px;
  
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
/*
const Background = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`
*/

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 5;
  
  padding: 20px;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--text-color-primary);
`

const AsidePhoto = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 4px solid var(--text-color-primary);
`

const AsideTitle = styled.div`
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  line-height: 125%;
  word-break: keep-all;
`

const AsideList = styled.ul`
  list-style-type: none;
  display: flex;
  margin: 0 0 -3px 0;
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

const RootPageLink = styled(HighlightedLink)`
  margin-top: 15px;
  font-size: 17px;
`

export default AsideView
