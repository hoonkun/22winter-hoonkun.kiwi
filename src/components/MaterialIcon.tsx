import React, { CSSProperties } from "react";
import styled from "@emotion/styled";

const MaterialIcon: React.FC<{ style?: CSSProperties, className?: string, i: string }> = ({ style, className, i }) => {
  return (
    <StyledMaterialIcon className={`${className} material-icons`} style={style}>{i}</StyledMaterialIcon>
  )
}

const StyledMaterialIcon = styled.span`

`

export default MaterialIcon
