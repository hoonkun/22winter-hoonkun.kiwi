import React, { CSSProperties, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Times } from "../../utils/Times";
import styled from "@emotion/styled";
import { EmptyFunction } from "../../utils/ktn";
import { paper } from "../../random";
import { Breakpoint } from "../../../styles/globals";

type RandomResponse = { image: string, text: string, duration: number }
type RandomPaperController = { make: () => void }

type RandomPaperState = "destroyed" | "transition-in" | "created" | "transition-out"

const TransitionInDuration = 250
const TransitionOutDuration = 500

const RootStates = {
  "destroyed": "out",
  "transition-out": "out",
  "transition-in": "in",
  "created": "in"
} as const

export const createPaperController: () => RandomPaperController = () => ({ make: EmptyFunction })

type Props = {
  controller: MutableRefObject<RandomPaperController>
  backgroundRender: JSX.Element
  loading: boolean
  onLoading: React.Dispatch<React.SetStateAction<boolean>>
  onPaperShow: React.Dispatch<React.SetStateAction<boolean>>
}

const RandomPaper: React.FC<Props> = ({ controller, backgroundRender, onLoading, loading, onPaperShow }) => {

  const [state, setState] = useState<RandomPaperState>("destroyed")
  const stateRef = useRef<RandomPaperState>("destroyed")
  const [random, setRandom] = useState<RandomResponse | null>(null)
  const [direction, setDirection] = useState<"normal" | "reversed">("normal")
  const [position, setPosition] = useState(100)

  const rootStyles = useMemo<CSSProperties>(() => ({
    top: `${position}%`,
    transitionDuration: state === "transition-in" ? `${TransitionInDuration}ms` : `${TransitionOutDuration}ms`,
    WebKitTransitionDuration: state === "transition-in" ? `${TransitionInDuration}ms` : `${TransitionOutDuration}ms`
  }), [state, position])

  const times = useRef(Times())

  const make = useCallback(async () => {
    if (stateRef.current !== "destroyed") return
    if (loading) return

    const data = paper()

    onLoading(true)
    const image = new Image()
    const load = times.current.until(image, "load")
    image.src = `/resources/images/random/${data.image}`
    await load

    onLoading(false)

    const position = Math.random() * 20
    onPaperShow(true);
    setDirection(Math.random() > 0.5 ? "normal" : "reversed")
    setPosition(2 + (Math.random() > 0.5 ? position : 68 + position))
    setRandom(data)
    setState("transition-in")
    await times.current.sleep(TransitionInDuration)
    setState("created")
    await times.current.sleep(data.duration)
    setState("transition-out")
    await times.current.sleep(TransitionOutDuration)
    setRandom(null)
    setState("destroyed")
    onPaperShow(false);
  }, [onLoading, loading, onPaperShow])

  useEffect(() => {
    const instance = times.current
    return () => instance.interrupt()
  }, [])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    controller.current.make = make
  }, [controller, make])

  return (
    <Root style={rootStyles} state={RootStates[state]}>
      {backgroundRender}
      <Content>
        {random &&
          <LimitedWidth style={{ flexDirection: direction === "reversed" ? "row-reverse" : "row" }}>
            <RandomImage src={`/resources/images/random/${random.image}`}/>
            <RandomText style={{ textAlign: direction === "reversed" ? "right" : "left" }}>{random.text}</RandomText>
          </LimitedWidth>
        }
      </Content>
    </Root>
  )
}

const Root = styled.div<{ state: "in" | "out" }>`
  position: fixed;
  z-index: 1000;
  
  width: 100vw;
  overflow: hidden;
  
  transition: clip-path cubic-bezier(0, 0.55, 0.45, 1);
  clip-path: ${({ state }) => state === "out" ? 
    "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)" :
    "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)"
  }
`

const Content = styled.div`
  position: relative;
  z-index: 1000;
  background-color: #00000090;
  
  padding: 10px 20px;
  ${Breakpoint} {
    padding: 20px 40px;
  }
  
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const RandomImage = styled.img`
  width: 65px;
  height: 65px;
  border: 3px solid var(--text-color-primary);
  
  ${Breakpoint} {
    width: 130px;
    height: 130px;
    border: 6px solid var(--text-color-primary);
  }
`

const RandomText = styled.div`
  color: var(--text-color-primary);
  white-space: pre-wrap;
  font-size: 13px;
  margin: 0 15px;
  ${Breakpoint} {
    font-size: 26px;
    margin: 0 30px; 
  }
`

const LimitedWidth = styled.div`
  width: 100%;
  max-width: 360px;
  ${Breakpoint} {
    max-width: 720px;
  }

  display: flex;
  align-items: center;
`

export default RandomPaper
