import "../utils/KTN";
import "../utils/String";

import {
  CSSProperties,
  TouchEventHandler,
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
import { FullFixed } from "../../styles/globals";
import PostsView, { PostPaginator } from "../components/home/PostsView";
import { Posts } from "../utils/Posts";
import { HomeStaticProps } from "./[...paths]";

import BackgroundResource from "../resources/images/background_original.jpg"
import ProfilePhotoResource from "../resources/images/profile_photo.jpg"
import Actionbar from "../components/home/Actionbar";
import { Times } from "../utils/Times";
import Router from "next/router";
import config from "../config";

const BackgroundRatio = BackgroundResource.width / BackgroundResource.height

const Home: NextPage<HomeStaticProps> = props => {

  const scrollable = useRef<HTMLDivElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const actionbar = useRef<HTMLDivElement>(null)

  const time = useRef(Times())

  const previousPage = useRef(props.routedPage)
  const [page, setPage] = useState(props.routedPage)

  const [[windowWidth, windowHeight], setWindowDimension]
    = useState<[number, number]>([-1, -1])

  const windowRatio
    = useMemo(() => windowWidth / windowHeight, [windowWidth, windowHeight])

  const backgroundFillMode
    = useMemo(() => windowRatio <= BackgroundRatio ? "height" : "width", [windowRatio])

  const [renderSplash, setRenderSplash] = useState(true)

  const [loading, setLoading] = useState(false)
  const [paperShowing, setPaperShowing] = useState(false)

  const scale = useMemo(() => windowWidth <= 840 ? 1 : 2, [windowWidth])

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

  const applyBackdrop = useCallback((height: number, position: number) => {
    if (!backdrop.current) return
    const ratio = (height - position).absolute / height

    const style = backdrop.current.style as any
    const filter = `blur(${ratio * 20}px) brightness(${(1 - ratio * 0.8)})`
    style.backdropFilter = filter
    style.webkitBackdropFilter = filter
  }, [])

  const applyActionbar = useCallback((height: number, position: number) => {
    if (!actionbar.current) return

    const ratio = (((height - position).absolute / height).coerceIn(0.8, 1) - 0.8) / 0.2
    const style = actionbar.current.style
    style.transform = `translateY(${60 * (ratio - 1)}px)`
  }, [])

  const onScroll = useCallback<UIEventHandler<HTMLDivElement>>(event => {
    const height = window.innerHeight
    const position = event.currentTarget.scrollTop

    applyBackdrop(height, position)
    applyActionbar(height, position)
  }, [applyBackdrop, applyActionbar])

  const onTouchEnd = useCallback<TouchEventHandler<HTMLDivElement>>(async () => {
    if (!scrollable.current) return
    const toBelowSection = scrollable.current.scrollTop > window.innerHeight;

    const prev = scrollable.current.scrollTop
    await time.current.sleep(10)
    const next = scrollable.current.scrollTop
    const delta = next - prev

    if (delta > 0 && toBelowSection) {
      setPage(previousPage.current ?? 1)
    } else if (delta < 0 && !toBelowSection) {

    }
    if (delta < 0 && toBelowSection) {
      setPage(null)
    }
  }, [])

  const toBelowSection = useCallback(() => {
    scrollable.current?.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" })
    setPage(previousPage.current ?? 1)
  }, [])

  const backToMain = useCallback(() => {
    scrollable.current?.scrollTo({ top: window.innerHeight, behavior: "smooth" })
    setPage(null)
  }, [])

  const next = useCallback(() => setPage(prevState => (prevState ?? 1) + 1), [])
  const previous = useCallback(() => setPage(prevState => (prevState ?? 1) - 1), [])
  const navigate = useCallback((page: number) => setPage(page), [])

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
    document.querySelector("html")!.style.fontSize = `${scale}px`
    if (scrollable.current && scale === 2) scrollable.current.style.pointerEvents = "none"
  }, [scale])

  useEffect(() => {
    if (windowWidth < 0 || windowHeight < 0) return
    const timeout = setTimeout(() => setRenderSplash(false), 1000)
    return () => clearTimeout(timeout)
  }, [windowWidth, windowHeight])

  useEffect(() => {
    if (!scrollable.current) return;
    if (!previousPage.current) scrollable.current.scrollTop = window.innerHeight
    else scrollable.current.scrollTop = window.innerHeight * 2
  }, [])

  useEffect(() => {
    if (page) previousPage.current = page
    if (scrollable.current) scrollable.current.style.pointerEvents = page && page > 1 ? "none" : "auto"
    if (!page) Router.replace(`/`, undefined).then()
    else Router.replace(`/page/${page}`, undefined).then();
  }, [page])

  return (
    <>
      <SnappedScroll ref={scrollable} onScroll={onScroll} onTouchEnd={onTouchEnd}>
        <About/>
        <DummyOverlay>
          <Root style={{ display: windowWidth < 0 || windowHeight < 0 ? "none" : "block" }}>
            <Background fillMode={backgroundFillMode} src={BackgroundResource.src}/>
            <BackdropFilterer style={backgroundFilter} zIndex={5}/>
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
                        <HighlightedLink size={10 * scale} color="#ffb300" href="https://unstabler.pl">Team Unstablers</HighlightedLink>
                        <HighlightedLink size={10 * scale} color="#dedede" href="https://github.com/hoonkun">GitHub</HighlightedLink>
                        <HighlightedLink size={10 * scale} color="#1d9bf0" href="https://twitter.com/arctic_apteryx">Twitter</HighlightedLink>
                        <HighlightedLink size={10 * scale} color="#595aff" href="https://twingyeo.kr/@hoon_kiwicraft" rel="me">Mastodon</HighlightedLink>
                      </ProfileLinks>
                    </ProfileInfo>
                  </Row>
                </MiddleContent>
              </MiddleArea>
              <Spacer height={8 * scale}/>
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
                  <RandomButton i={"arrow_forward"}/>
                  <Spacer width={8 * scale}/>
                  {!loading ?
                    <RandomButton disabled={paperShowing} i={"casino"} clickable onClick={() => paper.current.make()}/> :
                    <CircularProgressBar size={24}/>
                  }
                </BelowAreaContainer>
              </BelowArea>
            </Container>
            <RandomPaper
              scale={scale}
              controller={paper}
              backgroundRender={<Background fillMode={backgroundFillMode} src={BackgroundResource.src} fixed overlay/>}
              onLoading={setLoading}
              loading={loading}
              onPaperShow={setPaperShowing}
            />
            {scale === 2 &&
              <>
                <OverSectionNavigator>︿</OverSectionNavigator>
                <BelowSectionNavigator onClick={toBelowSection}>﹀</BelowSectionNavigator>
              </>
            }
          </Root>
        </DummyOverlay>
        <BackdropFilterer zIndex={10} ref={backdrop} fixed/>
        <PostsContainer><PostsView items={props.posts} paginator={paginator} /></PostsContainer>
      </SnappedScroll>
      <Actionbar ref={actionbar} onNavigateBack={backToMain}/>
      {renderSplash && <Splash active={windowWidth < 0 || windowHeight < 0}><LoadingParent><div/></LoadingParent></Splash>}
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
  pointer-events: none ;
  
  font-family: "IBM Plex Sans KR", sans-serif;
`

const SnappedScroll = styled.div`
  ${FullFixed};
  overflow: auto;
  scroll-snap-type: y mandatory;
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
  padding-left: 20rem;
  padding-right: 20rem;
  max-width: 400rem;

  color: var(--text-color-primary);
`

const OverArea = styled(SurroundingArea)`
  align-items: flex-start;
  margin-bottom: 10rem;
  
  font-size: 10rem;
  opacity: .45;
`

const MiddleArea = styled(Column)<{ sub?: boolean }>`
  width: 100%;
  background-color: ${({ sub }) => sub ? "#00000060" : "#00000080"};
  align-items: center;
`

const MiddleContent = styled(SurroundingArea)<{ narrow?: boolean, align2end?: boolean }>`
  align-items: stretch;
  padding-top: ${({ narrow }) => narrow ? 3 : 20}rem;
  padding-bottom: ${({ narrow }) => narrow ? 3 : 20}rem;
  ${({ narrow }) => narrow ? css`font-size: 12rem;` : ""}
  ${({ align2end }) => align2end ? css`align-items: flex-end;` : ""}
`

const Code = styled.div`
  font-family: "JetBrains Mono Light", sans-serif;
  font-size: 10rem;
  white-space: nowrap;
  transform: scale(0.8);
  transform-origin: right center;
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
  margin-top: 10rem;
`

const BelowAreaContainer = styled(Row)`
  height: 40rem;
  border-radius: 20rem;
  background-color: #00000060;
  align-items: center;
  padding: 0 10rem;
  margin-right: -5rem;
`

const ProfilePhotoContainer = styled.div`
  width: 60rem;
  height: 60rem;
  overflow: hidden;
  border-radius: 50%;
  flex-shrink: 0;
`

const ProfilePhoto = styled.img`
  width: 100%;
  height: 100%;
  scale: 1.2;
`

const ProfileInfo = styled(Column)`
  margin-left: 20rem;
  flex-grow: 1;
`

const ProfileIdentifiers = styled(Row)`
  align-items: flex-end;
`

const ProfileName = styled.div`
  font-size: 13rem;
  margin-left: 8rem;
  line-height: 18rem;
  opacity: .75;
`

const ProfileNickname = styled.div`
  font-weight: bold;
  font-size: 20rem;
  line-height: 23rem;
`

const ProfileMail = styled(HighlightedLink)`
  font-size: 12rem;
  align-self: center;
`

const ProfileMessage = styled.div`
  font-size: 13rem;
  line-height: 15rem;
  margin-top: 4rem;
  opacity: .75;
`

const ProfileLinks = styled(SlashedList)`
  margin-top: 5rem;
  font-size: 10rem;
`

const RandomButton = styled(MaterialIcon)<{ clickable?: boolean, disabled?: boolean }>`
  font-size: 24rem;
  
  ${({ clickable, disabled }) => !disabled && clickable ? css`cursor: pointer;` : ""}
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
`

const Splash = styled.div<{ active: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  
  transition: background-color 0.35s linear 0.05s;
  
  ${({ active }) => active ? css`
    background-color: black;
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

const SectionNavigator = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  font-size: 16rem;
  opacity: 0.4;
  cursor: pointer;
  pointer-events: auto;
`

const BelowSectionNavigator = styled(SectionNavigator)`
  bottom: 0;
  padding: 10px 10px 0 10px;
`

const OverSectionNavigator = styled(SectionNavigator)`
  top: 0;
  padding: 0 10px 10px 10px;
`

export default Home
