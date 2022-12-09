import React, { CSSProperties, ReactNode } from "react";
import styled from "@emotion/styled";


const DefaultSlashColor = "#ffffff"
const DefaultSpacing = 5

type Props = {
  children: ReactNode | ReactNode[]
  color?: string
  spacing?: number
  style?: CSSProperties
  className?: string
}

export const SlashedList: React.FC<Props> = ({ className, children, color, spacing, style }) => {

  if (!Array.isArray(children)) return <>{children}</>

  if (children.length === 0) return <></>

  return (
    <SlashedListRoot className={className} color={color ?? DefaultSlashColor} spacing={spacing ?? DefaultSpacing} style={style}>
      {children.map((it, index) => <div key={index}>{it}</div>)}
    </SlashedListRoot>
  )
}

const SlashedListRoot = styled.div<{ color: string, spacing: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  
  & > *:not(:last-of-type)::after {
    content: "/";
    margin: 0 ${({ spacing }) => spacing}px;
    display: inline;
    color: ${({ color }) => color};
    opacity: 0.45;
  }
`

export default SlashedList
