import "../utils/KTN";
import "../utils/String";

import {
  CSSProperties,
  UIEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { GetStaticProps, NextPage } from "next";
import styled from "@emotion/styled";
import HighlightedLink from "../components/HighlightedLink";
import SlashedList from "../components/SlashedList";
import Spacer from "../components/Spacer";
import MaterialIcon from "../components/MaterialIcon";
import RandomPaper, { createPaperController } from "../components/core/RandomPaper";
import CircularProgressBar from "../components/CircularProgressBar";
import { css, keyframes } from "@emotion/react";
import { Breakpoint, FullFixed, HideScrollbar } from "../../styles/globals";
import PostsView, { PostPaginator } from "../components/home/PostsView";
import { Posts } from "../utils/Posts";
import { HomeStaticProps } from "./[...paths]";

import BackgroundResource from "../resources/images/background_original.jpg"
import ProfilePhotoResource from "../resources/images/profile_photo.jpg"
import Actionbar from "../components/home/Actionbar";
import Router, { useRouter } from "next/router";
import config from "../config";

const BackgroundRatio = BackgroundResource.width / BackgroundResource.height

const Home: NextPage<HomeStaticProps> = props => {

  const initial = useRef(true)

  const scrollable = useRef<HTMLDivElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const actionbar = useRef<HTMLDivElement>(null)

  const { query: { paths } } = useRouter()
  const page = useMemo(() => paths?.[1] ? parseInt(paths[1]) : null, [paths])

  const [[windowWidth, windowHeight], setWindowDimension]
    = useState<[number, number]>([-1, -1])

  const windowRatio
    = useMemo(() => windowWidth / windowHeight, [windowWidth, windowHeight])

  const backgroundFillMode
    = useMemo(() => windowRatio <= BackgroundRatio ? "height" : "width", [windowRatio])

  const [renderSplash, setRenderSplash] = useState(true)

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

  const applyBackdrop = useCallback((position: number) => {
    if (!backdrop.current) return
    const width = window.innerWidth
    const ratio = (width - position).absolute / width

    const style = backdrop.current.style as any
    const filter = `blur(${ratio * 20}px) brightness(${(1 - ratio * 0.8)})`
    style.backdropFilter = filter
    style.webkitBackdropFilter = filter
  }, [])

  const applyActionbar = useCallback((position: number) => {
    if (!actionbar.current) return

    const width = window.innerWidth
    const ratio = (((width - position).absolute / width).coerceIn(0.8, 1) - 0.8) / 0.2
    const style = actionbar.current.style
    style.transform = `translate(-50%, ${(ratio - 1) * 100}%)`
  }, [])

  const saveStateToStorage = useCallback((position: number) => {
    const width = window.innerWidth
    const section = position.absolute <= 1 ? "about" : (position - width * 2).absolute <= 5 ? "posts" : "main"
    localStorage.setItem("section", section)
  }, [])

  const onScroll = useCallback<UIEventHandler<HTMLDivElement>>(event => {
    const position = event.currentTarget.scrollLeft

    applyBackdrop(position)
    applyActionbar(position)

    saveStateToStorage(position)
  }, [applyBackdrop, applyActionbar, saveStateToStorage])

  const toUpperSection = useCallback(() => {
    scrollable.current?.scrollTo({ left: 0, behavior: "smooth" })
  }, [])

  const toBelowSection = useCallback(() => {
    scrollable.current?.scrollTo({ left: window.innerWidth * 2, behavior: "smooth" })
  }, [])

  const backToMain = useCallback(() => {
    scrollable.current?.scrollTo({ left: window.innerWidth, behavior: "smooth" })
    Router.replace(`/`).then()
  }, [])

  const next = useCallback(() => Router.push(`/page/${(page ??  1) + 1}`), [page])
  const previous = useCallback(() => Router.push(page === 2 ? `/` : `/page/${(page ?? 1) - 1}`), [page])
  const navigate = useCallback((page: number) => Router.push(`/page/${page}`), [])

  const paginator = useMemo<PostPaginator>(() => ({
    next, previous, navigate, maxPage: (props.total / config.blog.page_size).ceil, page: page ?? 1
  }), [next, previous, navigate, props.total, page])

  useEffect(() => {
    const handler = () => setWindowDimension([window.innerWidth, window.innerHeight])
    handler()

    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  useEffect(() => {
    if (!initial.current) return
    if (!scrollable.current) return

    initial.current = false
    if (!page) {
      const section = localStorage.getItem("section")
      let scrollLeft: number
      if (section === "about") scrollLeft = 0
      else if (section === "posts") scrollLeft = window.innerWidth * 2
      else scrollLeft = window.innerWidth
      scrollable.current.scrollLeft = scrollLeft
      applyActionbar(scrollLeft)
      applyBackdrop(scrollLeft)
    } else {
      scrollable.current.scrollLeft = window.innerWidth * 2
      saveStateToStorage(window.innerWidth * 2)
    }
  }, [page, applyActionbar, applyBackdrop, saveStateToStorage])

  return (
    <>
      <SnappedScroll ref={scrollable} scrollable={!page} onScroll={onScroll}>
        <About/>
        <DummyOverlay>
          <Root style={{ display: windowWidth < 0 || windowHeight < 0 ? "none" : "block" }}>
            <Background fillMode={backgroundFillMode} src={BackgroundResource.src}/>
            <BackdropFilterer style={backgroundFilter} zIndex={5}/>
            <Container>
              <OverArea>
                <OverLinks>
                  <span onClick={toUpperSection}>〈 &nbsp; 키위새에 대해 &nbsp;</span> &nbsp; <span onClick={toBelowSection}>&nbsp; 아무말 집합소 &nbsp; 〉</span>
                </OverLinks>
                Photo by hoonkun in ≒ [37.523, 127.042] at {"'"}17.03.01
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
                    <CircularProgressBar size={24}/>
                  }
                </BelowAreaContainer>
              </BelowArea>
            </Container>
            <RandomPaper
              controller={paper}
              backgroundRender={<Background fillMode={backgroundFillMode} src={BackgroundResource.src} fixed overlay/>}
              onLoading={setLoading}
              loading={loading}
              onPaperShow={setPaperShowing}
            />
          </Root>
        </DummyOverlay>
        <BackdropFilterer zIndex={10} ref={backdrop} fixed/>
        <PostsContainer><PostsView items={props.posts} paginator={paginator} requestSplash={setRenderSplash} /></PostsContainer>
      </SnappedScroll>
      <Actionbar ref={actionbar} onNavigateBack={backToMain}/>
      <Splash active={windowWidth < 0 || windowHeight < 0 || renderSplash} translucent={windowWidth > 0 && windowHeight > 0}>
        <LoadingParent><div/></LoadingParent>
      </Splash>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeStaticProps> = () => {
  return { props: { posts: Posts.list(1), routedPage: null, total: Posts.total } }
}

const Root = styled.div`
  ${FullFixed};
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
`

const SnappedScroll = styled.div<{ scrollable: boolean }>`
  font-family: "IBM Plex Sans KR", sans-serif;
  
  ${FullFixed};
  ${HideScrollbar};
  scroll-snap-type: x mandatory;
  display: flex;
  
  & > div { flex-shrink: 0; }
  
  overflow: ${({ scrollable }) => scrollable ? "overlay" : "hidden"};
  
  ${Breakpoint} {
    overflow: hidden;
  }
`

const DummyOverlay = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: auto;
  position: relative;
  scroll-snap-align: center;
  scroll-snap-stop: always;
`

const PostsContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 15;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const About = PostsContainer;

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

const Background = styled.img<{ fillMode: "width" | "height", fixed?: boolean, overlay?: boolean }>`
  position: ${({ fixed }) => fixed ? "fixed" : "absolute"};
  z-index: ${({ overlay }) => overlay ? 1 : 0};
  ${({ fillMode }) => fillMode}: 100%;
  ${({ overlay }) => overlay ? css`filter: blur(3px);` : ""}
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
  opacity: .45;
  
  margin-bottom: 10px;
  font-size: 10px;
  
  ${Breakpoint} {
    margin-bottom: 20px;
    font-size: 20px;
  }
`

const OverLinks = styled.div`
  margin-left: -7px;
  pointer-events: auto;
  
  & > span {
    cursor: pointer;
  }
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
  }
`

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

export default Home
