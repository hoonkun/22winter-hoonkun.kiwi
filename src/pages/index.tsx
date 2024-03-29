import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NextPage } from "next";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

import HighlightedLink from "../components/HighlightedLink";
import SlashedList from "../components/SlashedList";
import Spacer from "../components/Spacer";
import MaterialIcon from "../components/MaterialIcon";
import RandomPaper, { createPaperController } from "../components/core/RandomPaper";
import CircularProgressBar from "../components/CircularProgressBar";

import { Breakpoint, FullFixed } from "../../styles/globals";

import BackgroundResource from "../resources/images/background_original.jpg"
import ProfilePhotoResource from "../resources/images/profile_photo.jpg"
import { SplashView } from "../components/SplashView";
import Link from "next/link";

const BackgroundRatio = BackgroundResource.width / BackgroundResource.height

const Home: NextPage = () => {

  const scrollable = useRef<HTMLDivElement>(null)

  const [[windowWidth, windowHeight], setWindowDimension]
    = useState<[number, number]>([-1, -1])

  const windowRatio
    = useMemo(() => windowWidth / windowHeight, [windowWidth, windowHeight])

  const backgroundFillMode
    = useMemo(() => windowRatio <= BackgroundRatio ? "height" : "width", [windowRatio])

  const [loading, setLoading] = useState(false)
  const [paperShowing, setPaperShowing] = useState(false)

  const paper = useRef(createPaperController())

  const dp = useMemo(() => {
    const source = backgroundFillMode === "width" ? BackgroundResource.width : BackgroundResource.height
    const real = backgroundFillMode === "width" ? windowWidth : windowHeight
    return real / source
  }, [backgroundFillMode, windowWidth, windowHeight])

  const backgroundFilter = useMemo<CSSProperties>(() =>
    `blur(${(dp * 30).floor}px) brightness(0.75)`.let(it => ({ backdropFilter: it, WebkitBackdropFilter: it })),
    [dp]
  );

  const paperShown = useCallback(() => {
    setPaperShowing(true);
  }, [])

  const paperHidden = useCallback(() => {
    setPaperShowing(false);
  }, [])

  useEffect(() => {
    const handler = () => setWindowDimension([window.innerWidth, window.innerHeight])
    handler()

    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  useEffect(() => {
    if (!scrollable.current) return
    scrollable.current.scrollLeft = window.innerWidth
  }, [])

  return (
    <>
      <Global styles={css`html, body { overflow: hidden; position: fixed; height: calc(100% - 1px); } #__next { height: 100%; }`}/>
      <Root style={{ display: windowWidth < 0 || windowHeight < 0 ? "none" : "block" }}>
        <Background fillMode={backgroundFillMode} src={BackgroundResource.src} paperShowing={paperShowing}/>
        <BackdropFilterer style={backgroundFilter} zIndex={5}/>
        <Container paperShowing={paperShowing}>
          <OverArea>
            <OverLinks>
              <Link href={"/posts/1"}>아무말 집합소 &nbsp; <LinkArrow i={"arrow_forward"}/></Link>
            </OverLinks>
            <OverText>Photo by hoonkun in ≒ [37.523, 127.042] at {"'"}17.03.01</OverText>
          </OverArea>
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
                    <HighlightedLink color="#ffb300" href="https://unstabler.pl">Team Unstablers</HighlightedLink>
                    <HighlightedLink color="#dedede" href="https://github.com/hoonkun">GitHub</HighlightedLink>
                    <HighlightedLink color="#1d9bf0" href="https://twitter.com/arctic_apteryx">Twitter</HighlightedLink>
                    <HighlightedLink color="#595aff" href="https://twingyeo.kr/@hoon_kiwicraft" rel="me">Mastodon</HighlightedLink>
                  </ProfileLinks>
                </ProfileInfo>
              </Row>
            </MiddleContent>
          </MiddleArea>
          <MiddleArea sub>
            <MiddleContent narrow align2end>
              <Code>
                <Orange>val</Orange> random = KiwiRandom {"{"} <Gold><i>fetch</i></Gold>(
                <Green>&quot;/api/random&quot;</Green>, Fetchers.<Purple>Get</Purple>) {"}"}
              </Code>
            </MiddleContent>
          </MiddleArea>
          <BelowArea>
            <BelowAreaContainer>
              <RandomButton i={"arrow_forward"} margin/>
              {!loading ?
                <RandomButton disabled={paperShowing} i={"casino"} clickable onClick={() => paper.current.make()}/> :
                <CircularProgressBar/>
              }
            </BelowAreaContainer>
          </BelowArea>
        </Container>
      </Root>
      <RandomPaper
        controller={paper}
        loading={loading}
        onLoading={setLoading}
        onPaperShow={paperShown}
        onPaperHide={paperHidden}
      />
      <SplashView active={windowWidth < 0 || windowHeight < 0}/>
    </>
  )
}

const Root = styled.div`
  ${FullFixed};
  height: 100%;
  top: 0;
  left: 0;
`

const Row = styled.div`
  display: flex;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const BackdropFilterer = styled.div<{ zIndex: number, fixed?: boolean }>`
  position: ${({ fixed }) => fixed ? "fixed" : "absolute"};
  z-index: ${({ zIndex }) => zIndex};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const Background = styled.img<{ fillMode: "width" | "height", paperShowing: boolean }>`
  position: absolute;
  z-index: 0;
  ${({ fillMode }) => fillMode}: 100%;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  transform: translate(-50%, -50%) scale(1.3) translateX(-80px);

  transition: filter ${({ paperShowing }) => paperShowing ? 0.25 : 0.5}s linear;
  ${({ paperShowing }) => paperShowing ? css`filter: brightness(0.5);` : css`filter: none;`}
`

const Container = styled(Column)<{ paperShowing: boolean }>`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;

  transition: filter ${({ paperShowing }) => paperShowing ? 0.25 : 0.5}s linear;
  ${({ paperShowing }) => paperShowing ? css`filter: blur(16px) brightness(0.5);` : css`filter: none;`}
`

const SurroundingArea = styled(Column)`
  width: 100%;
  color: var(--text-color-primary);
  
  padding-left: 20px;
  padding-right: 20px;
  max-width: 400px;
  
  ${Breakpoint} {
    padding-left: 40px;
    padding-right: 40px;
    max-width: 800px;
  }
`

const OverArea = styled(SurroundingArea)`
  align-items: flex-start;
  
  margin-bottom: 10px;
  font-size: 10px;
  
  ${Breakpoint} {
    margin-bottom: 20px;
    font-size: 20px;
  }
`

const OverLinks = styled.div`
  pointer-events: auto;
  
  & > span {
    cursor: pointer;
  }
  
  & > a {
    display: flex;
    flex-direction: row;
    align-items: center;
    opacity: .75;
    transition: opacity 0.1s linear;
    
    &:hover {
      opacity: 1;
    }
  }
`

const LinkArrow = styled(MaterialIcon)`
  font-size: 12px;
  
  ${Breakpoint} {
    font-size: 20px;
  }
`

const OverText = styled.div`
  opacity: .45;
`

const MiddleArea = styled(Column)<{ sub?: boolean }>`
  width: 100%;
  background-color: ${({ sub }) => sub ? "#00000060" : "#00000080"};
  align-items: center;

  margin-top: ${({ sub }) => sub ? 8 : 0}px;
  
  ${Breakpoint} {
    margin-top: ${({ sub }) => sub ? 16 : 0}px;
  }
`

const MiddleContent = styled(SurroundingArea)<{ narrow?: boolean, align2end?: boolean }>`
  align-items: stretch;
  ${({ align2end }) => align2end ? css`align-items: flex-end;` : ""}

  padding-top: ${({ narrow }) => narrow ? 3 : 20}px;
  padding-bottom: ${({ narrow }) => narrow ? 3 : 20}px;
  ${({ narrow }) => narrow ? css`font-size: 12px;` : ""}
  
  ${Breakpoint} {
    padding-top: ${({ narrow }) => narrow ? 6 : 40}px;
    padding-bottom: ${({ narrow }) => narrow ? 6 : 40}px;
    ${({ narrow }) => narrow ? css`font-size: 24px;` : ""}
  }
`

const Code = styled.div`
  font-family: "JetBrains Mono Light", sans-serif;
  white-space: nowrap;
  transform: scale(0.8);
  transform-origin: right center;
  
  font-size: 10px;
  
  ${Breakpoint} {
    font-size: 20px;
  }
`

const Orange = styled.span`
  color: #cc7832;
`

const Gold = styled.span`
  color: #ffc66d;
`

const Green = styled.span`
  color: #6A8759;
`

const Purple = styled.span`
  color: #9876AA;
`

const BelowArea = styled(SurroundingArea)`
  align-items: flex-end;
  
  margin-top: 10px;
  
  ${Breakpoint} {
    margin-top: 20px;
  }
`

const BelowAreaContainer = styled(Row)`
  background-color: #00000060;
  align-items: center;

  height: 40px;
  border-radius: 20px;
  padding: 0 10px;
  margin-right: -5px;
  
  ${Breakpoint} {
    height: 80px;
    border-radius: 40px;
    padding: 0 20px;
    margin-right: -10px;
  }
`

const ProfilePhotoContainer = styled.div`
  overflow: hidden;
  border-radius: 50%;
  flex-shrink: 0;
  
  width: 60px;
  height: 60px;
  
  ${Breakpoint} {
    width: 120px;
    height: 120px;
  }
`

const ProfilePhoto = styled.img`
  width: 100%;
  height: 100%;
  scale: 1.2;
`

const ProfileInfo = styled(Column)`
  flex-grow: 1;
  
  margin-left: 20px;
  
  ${Breakpoint} {
    margin-left: 40px;
  }
`

const ProfileIdentifiers = styled(Row)`
  align-items: flex-end;
`

const ProfileName = styled.div`
  opacity: .75;
  
  font-size: 13px;
  margin-left: 8px;
  line-height: 18px;
  
  ${Breakpoint} {
    font-size: 26px;
    margin-left: 16px;
    line-height: 36px;
  }
`

const ProfileNickname = styled.div`
  font-weight: bold;
  
  font-size: 20px;
  line-height: 23px;

  ${Breakpoint} {
    font-size: 40px;
    line-height: 46px;
  }
`

const ProfileMail = styled(HighlightedLink)`
  align-self: center;
  
  font-size: 12px;
  
  ${Breakpoint} {
    font-size: 24px;
  }
`

const ProfileMessage = styled.div`
  opacity: .75;
  
  font-size: 13px;
  line-height: 15px;
  margin-top: 4px;
  
  ${Breakpoint} {
    font-size: 26px;
    line-height: 30px;
    margin-top: 8px;
  }
`

const ProfileLinks = styled(SlashedList)`
  margin-top: 5px;
  font-size: 10px;
  
  ${Breakpoint} {
    margin-top: 10px;
    font-size: 20px;
  }
`

const RandomButton = styled(MaterialIcon)<{ clickable?: boolean, disabled?: boolean, margin?: boolean }>`
  ${({ clickable, disabled }) => !disabled && clickable ? css`cursor: pointer;` : ""}
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  
  margin-right: ${({ margin }) => margin ? 8 : 0}px;
  
  font-size: 24px;
  
  ${Breakpoint} {
    font-size: 48px;
    margin-right: ${({ margin }) => margin ? 16 : 0}px;
    ${({ disabled, clickable }) => !clickable || disabled ? "" : css`
      &:hover {
        background-color: #ffffff30;
        border-radius: 6px;
      }
    `}
  }
`

export default Home
