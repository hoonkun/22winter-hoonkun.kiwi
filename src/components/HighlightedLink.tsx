import React, { CSSProperties, PropsWithChildren, useEffect, useRef } from "react";
import styled from "@emotion/styled";

type Props = {
  color?: string
  style?: CSSProperties
  className?: string
}

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

const DefaultHighlightColor = "#ffffff"

const HighlightedLink: React.FC<PropsWithChildren<Props & AnchorProps>> = ({ href, className, onClick, color, children, style, ...props }) => {

  const root = useRef<HTMLDivElement>(null)
  const highlight = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || !highlight.current) return

    const size = window.getComputedStyle(root.current).fontSize.px
    const value = `${size / 2}px`;
    highlight.current.style.height = value
    highlight.current.style.marginTop = `-${value}`
  }, [])

  return (
    <AnchorStyled ref={root} className={className} style={style}>
      <Text href={href} onClick={onClick} {...props}>{children}</Text>
      <Highlight ref={highlight} color={color ?? DefaultHighlightColor} />
    </AnchorStyled>
  )
}

HighlightedLink.defaultProps = {
  color: DefaultHighlightColor,
}

const AnchorStyled = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  pointer-events: auto;
`

const Text = styled.a`
  position: relative;
  z-index: 1;
  line-height: 100%;
`

const Highlight = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  margin-left: -2px;
  margin-right: -2px;
  transform: translateY(1px);
  opacity: .2;
  z-index: 0;
  position: relative;
`

export default HighlightedLink
