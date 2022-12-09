import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import styled from "@emotion/styled";

import BackgroundResource from "../resources/images/background_original.jpg"
import ProfilePhotoResource from "../resources/images/profile_photo.jpg"
import HighlightedLink from "../components/HighlightedLink";
import SlashedList from "../components/SlashedList";
import Spacer from "../components/Spacer";
import MaterialIcon from "../components/MaterialIcon";

const BackgroundRatio = BackgroundResource.width / BackgroundResource.height

const Home: NextPage = () => {

  const [[windowWidth, windowHeight], setWindowDimension]
    = useState<[number, number]>([window.innerWidth, window.innerHeight])

  const windowRatio
    = useMemo(() => windowWidth / windowHeight, [windowWidth, windowHeight])

  const backgroundFillMode
    = useMemo(() => windowRatio <= BackgroundRatio ? "height" : "width", [windowRatio])

  const dp = useMemo(() => {
    const source = backgroundFillMode === "width" ? BackgroundResource.width : BackgroundResource.height
    const real = backgroundFillMode === "width" ? windowWidth : windowHeight
    return real / source
  }, [backgroundFillMode, windowWidth, windowHeight])

  const filterCSS = useMemo(() => `blur(${Math.floor(dp * 30)}px) brightness(0.75)`, [dp])

  useEffect(() => {
    const handler = () => setWindowDimension([window.innerWidth, window.innerHeight])
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  return (
    <Root>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no"/>
        <title>극지대의 키위새</title>
      </Head>
      <BackgroundContainer fillMode={backgroundFillMode} src={BackgroundResource.src}/>
      <BackdropFilterer style={{ backdropFilter: filterCSS, WebkitBackdropFilter: filterCSS }}/>
      <Container>
        <OverArea>Photo by hoonkun in ≒ [37.523, 127.042] at {"'"}17.03.01</OverArea>
        <MiddleArea>
          <MiddleContent>
            <Row>
              <ProfilePhotoContainer><ProfilePhoto src={ProfilePhotoResource.src}/></ProfilePhotoContainer>
              <ProfileInfo>
                <ProfileIdentifiers>
                  <ProfileNickname>극지대 키위새</ProfileNickname>
                  <ProfileName>한고훈</ProfileName>
                  <Spacer grow/>
                  <ProfileMail href="mailto:herokun.user@gmail.com">@</ProfileMail>
                </ProfileIdentifiers>
                <ProfileMessage>재미있어보이는 것들을 살펴보는 햇병아리 개발자</ProfileMessage>
                <ProfileLinks>
                  <HighlightedLink size={10} color="#ffb300" href="https://unstabler.pl">Team Unstablers</HighlightedLink>
                  <HighlightedLink size={10} color="#dedede" href="https://github.com/hoonkun">GitHub</HighlightedLink>
                  <HighlightedLink size={10} color="#1d9bf0" href="https://twitter.com/arctic_apteryx">Twitter</HighlightedLink>
                  <HighlightedLink size={10} color="#595aff" href="https://twingyeo.kr/@hoon_kiwicraft" rel="me">Mastodon</HighlightedLink>
                </ProfileLinks>
              </ProfileInfo>
            </Row>
          </MiddleContent>
        </MiddleArea>
        <BelowArea>
          <BelowAreaContainer>
            <MaterialIcon i={"casino"}/>
            <Spacer width={8}/>
            <MaterialIcon i={"arrow_upward"}/>
          </BelowAreaContainer>
        </BelowArea>
      </Container>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  font-family: "IBM Plex Sans KR", sans-serif;
`

const Row = styled.div`
  display: flex;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const BackdropFilterer = styled.div`
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const BackgroundContainer = styled.img<{ fillMode: "width" | "height" }>`
  position: absolute;
  z-index: 0;
  ${({ fillMode }) => fillMode}: 100%;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  transform: translate(-50%, -50%) scale(1.3) translateX(-80px);
`

const Container = styled(Column)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
`

const SurroundingArea = styled(Column)`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  max-width: 400px;

  color: var(--text-color-primary);
`

const OverArea = styled(SurroundingArea)`
  align-items: flex-start;
  margin-bottom: 10px;
  
  font-size: 10px;
  opacity: .45;
  
  font-family: "JetBrains Mono Light", sans-serif;
`

const MiddleArea = styled(Column)`
  width: 100%;
  background-color: #00000080;
  align-items: center;
`

const MiddleContent = styled(SurroundingArea)`
  align-items: stretch;
  padding-top: 20px;
  padding-bottom: 20px;
`

const BelowArea = styled(SurroundingArea)`
  align-items: flex-end;
  margin-top: 10px;
`

const BelowAreaContainer = styled(Row)`
  height: 40px;
  border-radius: 20px;
  background-color: #00000060;
  align-items: center;
  padding: 0 10px;
  margin-right: -5px;
`

const ProfilePhotoContainer = styled.div`
  width: 60px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 50%;
`

const ProfilePhoto = styled.img`
  width: 100%;
  height: 100%;
  scale: 1.2;
`

const ProfileInfo = styled(Column)`
  margin-left: 20px;
  flex-grow: 1;
`

const ProfileIdentifiers = styled(Row)`
  align-items: flex-end;
`

const ProfileName = styled.div`
  font-size: 13px;
  margin-left: 8px;
  line-height: 18px;
  opacity: .75;
`

const ProfileNickname = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
`

const ProfileMail = styled(HighlightedLink)`
  font-size: 12px;
  align-self: center;
`

const ProfileMessage = styled.div`
  font-size: 13px;
  line-height: 15px;
  margin-top: 4px;
  opacity: .75;
`

const ProfileLinks = styled(SlashedList)`
  margin-top: 5px;
  font-size: 10px;
`

export default Home;
