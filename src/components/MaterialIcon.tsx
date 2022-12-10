import React, { CSSProperties } from "react";
import styled from "@emotion/styled";

type SpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

const MaterialIcon: React.FC<{ style?: CSSProperties, className?: string, i: string } & SpanProps> = ({ style, className, i, ...props }) => {
  return (
    <StyledMaterialIcon {...props} className={`${className} material-icons`} style={style}>{i}</StyledMaterialIcon>
  )
}

const StyledMaterialIcon = styled.span`

`

export default MaterialIcon
