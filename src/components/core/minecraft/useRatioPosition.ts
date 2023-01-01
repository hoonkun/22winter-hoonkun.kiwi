import { useMemo } from "react";

const BackgroundRatio = 16 / 10 // 1.6, 0.8

const calculateRatioPosition: (width: number, height: number, input: number, which: "x" | "y") => number = (width, height, input, which) => {
  if (width === 0 || height === 0) return 0

  const centered = input - 0.5
  const windowRatio = width / height

  if (which === "x") {
    const reference = windowRatio > BackgroundRatio ? width : height * BackgroundRatio
    return (reference * centered + width / 2) / width * 100
  } else if (which === "y") {
    const reference = windowRatio > BackgroundRatio ? width / BackgroundRatio : height
    return (reference * centered + height / 2) / height * 100
  } else {
    console.error("unknown type of useRatioPosition.calculateRatioPosition")
    return 0
  }
}

export const useRatioPosition: (input: { width: number, height: number, x: number, y: number }) => [number, number] = ({ width, height, x, y }) => {
  const ratioX = useMemo(() => calculateRatioPosition(width, height, x, "x"), [width, height, x])
  const ratioY = useMemo(() => calculateRatioPosition(width, height, y, "y"), [width, height, y])

  return [ratioX, ratioY]
}
