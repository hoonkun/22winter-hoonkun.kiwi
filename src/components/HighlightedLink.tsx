import React, { CSSProperties, PropsWithChildren } from "react";
import styled from "@emotion/styled";

type Props = {
  color?: string
  size?: number
  style?: CSSProperties
  className?: string
}

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

const DefaultHighlightColor = "#ffffff"
const DefaultFontSize = 12

const HighlightedLink: React.FC<PropsWithChildren<Props & AnchorProps>> = ({ href, className, onClick, color, children, size, style, ...props }) => {
  return (
    <AnchorStyled className={className} style={style}>
      <Text href={href} onClick={onClick} {...props}>{children}</Text>
      <Highlight color={color ?? DefaultHighlightColor} size={(size ?? DefaultFontSize) / 2}/>
    </AnchorStyled>
  )
}

HighlightedLink.defaultProps = {
  color: DefaultHighlightColor,
  size: DefaultFontSize
}

const AnchorStyled = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
`

const Text = styled.a`
  position: relative;
  z-index: 1;
  line-height: 100%;
`

const Highlight = styled.div<{ color: string, size: number }>`
  background-color: ${({ color }) => color};
  height: ${({ size }) => size}px;
  margin-left: -2px;
  margin-right: -2px;
  margin-top: -${({ size }) => size}px;
  transform: translateY(1px);
  opacity: .2;
  z-index: 0;
  position: relative;
`

export default HighlightedLink
