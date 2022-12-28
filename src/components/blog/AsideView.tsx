import React from "react";
import styled from "@emotion/styled";
import { Breakpoint } from "../../../styles/globals";

import ProfilePhotoResource from "./../../resources/images/profile_photo.jpg"
import BackgroundResource from "./../../resources/images/background_original.jpg"
import HighlightedLink from "../HighlightedLink";

export const AsideView: React.FC = () => {
  return (
    <Root>
      <Background src={BackgroundResource.src}/>
      <Overlay>
        <AsidePhoto src={ProfilePhotoResource.src}/>
        <AsideTitle>키위새의 아무말 집합소</AsideTitle>
        <AsideList>{["코딩", "생명과학II", "마인크래프트", "일상"].map(it => <li key={it}>{it}</li>)}</AsideList>
        <RootPageLink href={"https://hoonkun.kiwi"} color={"#689f38"}>hoonkun.kiwi</RootPageLink>
      </Overlay>
    </Root>
  )
}

const Root = styled.div`
  position: relative;
  
  width: 100%;
  height: 35%;
  
  min-height: 400px;
  
  ${Breakpoint} {
    min-width: 400px;
    width: 35%;
    height: 100%;
  }
`

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
