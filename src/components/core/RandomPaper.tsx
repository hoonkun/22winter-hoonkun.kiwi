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
  loading: boolean
  onLoading: React.Dispatch<React.SetStateAction<boolean>>
  onPaperShow: () => void
  onPaperHide: () => void
}

const RandomPaper: React.FC<Props> = ({ controller, onLoading, loading, onPaperShow, onPaperHide }) => {

  const [state, setState] = useState<RandomPaperState>("destroyed")
  const stateRef = useRef<RandomPaperState>("destroyed")
  const [random, setRandom] = useState<RandomResponse | null>(null)

  const rootStyles = useMemo<CSSProperties>(() => ({
    transitionDuration: state === "transition-in" ? `${TransitionInDuration}ms` : `${TransitionOutDuration}ms`,
    WebKitTransitionDuration: state === "transition-in" ? `${TransitionInDuration}ms` : `${TransitionOutDuration}ms`
  }), [state])

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

    onPaperShow();
    setRandom(data)
    setState("transition-in")
    await times.current.sleep(TransitionInDuration)
    setState("created")
    await times.current.sleep(data.duration)
    setState("transition-out")
    onPaperHide();
    await times.current.sleep(TransitionOutDuration)
    setRandom(null)
    setState("destroyed")
  }, [onLoading, loading, onPaperShow, onPaperHide])

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
    <PaperRoot style={rootStyles} state={RootStates[state]}>
      {random &&
        <LimitedWidth>
          <RandomImage src={`/resources/images/random/${random.image}`}/>
          <RandomText>{random.text}</RandomText>
        </LimitedWidth>
      }
    </PaperRoot>
  )
}

const PaperRoot = styled.div<{ state: "in" | "out" }>`
  position: fixed;
  
  width: 100vw;
  overflow: hidden;
  
  top: calc(50% - 42.5px);
  ${Breakpoint} {
    top: calc(50% - 85px);
  }
  
  display: flex;
  flex-direction: column;
  align-items: center;
  
  z-index: 1000;
  
  background-color: #00000090;
  
  transition: clip-path cubic-bezier(0, 0.55, 0.45, 1);
  clip-path: ${({ state }) => state === "out" ? 
    "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)" :
    "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)"
  }
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
  max-width: 400px;

  padding: 10px 20px;
  
  ${Breakpoint} {
    padding: 20px 40px;
    max-width: 800px;
  }

  display: flex;
  align-items: center;
`

export default RandomPaper
