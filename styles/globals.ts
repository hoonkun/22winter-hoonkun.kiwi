import { css } from "@emotion/react";

export const HideScrollbar = css`
  &::-webkit-scrollbar {
    display: none;
  }
`

export const OverlayOverflow = css`overflow: overlay;`

export const Breakpoint = `@media only screen and (min-width: 840px)`

export const ScaleBreakpoint = `@media only screen and (max-width: 1400px) and (min-width: 840px)`

export const FullFixed = css`
  position: fixed;
  width: 100%;
  height: calc(100% - 1px);
  
  ${Breakpoint} {
    height: 100%;
  }
`

export const not = (selector: string) => {
  if (selector === Breakpoint) {
    return `@media only screen and (max-width: 840px)`;
  }
  return undefined;
}
