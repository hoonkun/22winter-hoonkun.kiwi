import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

type SpacerProps = {
  width?: number
  height?: number
  grow?: boolean
}

const Spacer: React.FC<SpacerProps> = props => {
  return <SpacerStyled {...props}>&nbsp;</SpacerStyled>;
};

const SpacerStyled = styled.div<SpacerProps>`
    user-select: none;
    
    font-size: 1px;
    
    ${({ width }) => width && css`width: ${width}px; flex-shrink: 0;`}
    ${({ height }) => height && css`height: ${height}px; flex-shrink: 0;`}
    ${({ grow }) => grow && css`flex-grow: 1;`}
`;

export default Spacer;
