import { css } from "@emotion/react";


export const FullFixed = css`
  position: fixed;
  width: 100%;
  height: calc(100% - 1px);
`

export const HideScrollbar = css`
  &::-webkit-scrollbar {
    display: none;
  }
`

export const OverlayOverflow = css`overflow: overlay;`

export const Breakpoint = `@media only screen and (min-width: 840px)`
