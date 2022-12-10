import React, { CSSProperties, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { uuid4 } from "../../utils/UUID";
import styled from "@emotion/styled";
import { also } from "../../utils/Any";
import { keyframes } from "@emotion/react";
import { Arrays } from "../../utils/Array";


const EmptyLambda: (...args: any[]) => any = () => {}

type RandomSnacksController = {
  make: () => string
  destroy: (uuid: string) => void
}

type RandomSnackController = {
  setState: (state: string) => void
}

type RandomSnackInstance = {
  uuid: string
  image: string
  text: string
  controller: RandomSnackController
  duration: number
}

type RandomSnackResponse = { image: string, text: string }

type Props = {
  controller: MutableRefObject<RandomSnacksController>
}

export const generateSnacksController: () => RandomSnacksController = () => {
  return ({ make: EmptyLambda, destroy: EmptyLambda })
}

const RandomSnacks: React.FC<Props> = ({ controller }) => {

  const [snacks, setSnacks] = useState<RandomSnackInstance[]>([])
  const timeouts = useRef<NodeJS.Timeout[]>([])

  const make = useCallback(() => {
    const uuid = uuid4()
    const async = async () => {
      const response = await fetch(`${location.origin}/api/random`, { method: 'GET' })
      const { text, image } = (await response.json()) as RandomSnackResponse
      const controller = generateSnackController()
      const duration = 5000 + Math.random() * 3000
      const newSnack = { uuid, text, image, controller, duration }
      setSnacks(prevState => [...prevState, newSnack])
      timeouts.current.push(setTimeout(() => {
        setSnacks(prevState => also([...prevState], it => it.splice(it.indexOf(newSnack), 1)))
      }, duration))
    }
    async().then()
    return uuid
  }, [])

  useEffect(() => {
    controller.current.make = make
  }, [controller, make])

  return (<>{snacks.map(it => <RandomSnack key={it.uuid} instance={it}/>)}</>)
}

const generateSnackController: () => RandomSnackController = () => {
  return ({ setState: EmptyLambda })
}

const RandomSnack: React.FC<{ instance: RandomSnackInstance }> = ({ instance }) => {

  const top = useMemo(() => 50 + Math.random() * 300, [])

  return (
    <SnackRoot style={{ top }}>
      <RandomSnackEffects/>
    </SnackRoot>
  )
}

const RandomSnackEffects: React.FC = () => {

  const length = useMemo(() => Math.ceil(Math.random() * 2), [])
  const directions = useMemo(() => Arrays().create(length, () => Math.random() > 0.5 ? 1 : -1), [length])
  const rotations = useMemo(() =>
    Arrays().create(length, () => (Math.random() - 0.5) * 15).sort().reverse(),
    [length]
  )
  const offsets = useMemo(() =>
    Arrays().create(length, index => directions[index] * rotations[index] * 8 + (Math.random() - 0.5) * 25).sort(),
    [length, rotations, directions]
  )

  return (
    <>
      {Arrays().create(length, index =>
        <RandomSnackEffect offset={offsets[index]} direction={directions[index]} rotation={rotations[index]} delayed={index > 0}/>
      )}
    </>
  )
}

const RandomSnackEffect: React.FC<{ offset: number, delayed?: boolean, rotation: number, direction: -1 | 1 }> = ({ offset, delayed, rotation, direction }) => {

  const height = useMemo(() => 50 + Math.random() * 100, [])

  const duration = useMemo(() => 200 + Math.random() * 400, [])
  const delay = useMemo(() => delayed ? 25 + Math.random() * 100 : 0, [delayed])

  const effectStyle = useMemo<CSSProperties>(() => ({
    rotate: `z ${rotation + (direction === 1 ? 180 : 0)}deg`,
    height: height,
    animationDuration: `${duration}ms`,
    WebkitAnimationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
    WebkitAnimationDelay: `${delay}ms`,
    transform: `translateY(${offset}px)`,
    ...(direction === 1 ? { right: "-200vw" } : { left: "-200vw" })
  }), [rotation, direction, height, duration, delay, offset])

  return (
    <SnackEffect style={effectStyle}/>
  )
}

const SnackRoot = styled.div`
  position: fixed;
  left: 0;
  z-index: 500;
`

const SnackEffectAnimation = keyframes`
  from {
    clip-path: polygon(0% 0%, 50% 50%, 0% 100%);
  }
  to {
    clip-path: polygon(50% 50%, 100% 50%, 50% 50%);
  }
`

const SnackEffect = styled.div`
  position: fixed;
  width: 400vw;
  animation-name: ${SnackEffectAnimation};
  animation-fill-mode: forwards;
  background-color: #00000040;

  clip-path: polygon(0% 0%, 50% 50%, 0% 100%);
`

export default RandomSnacks
