import React from "react";
import styled from "@emotion/styled";
import MaterialIcon from "../MaterialIcon";
import { Breakpoint } from "../../../styles/globals";

type Props = {
  onNavigateBack: () => void
}

const Actionbar = React.forwardRef<HTMLDivElement, Props>((props, ref) => {

  const { onNavigateBack } = props

  return (
    <Root ref={ref}>
      <MaterialIcon i={"arrow_back"} onClick={onNavigateBack}/>
    </Root>
  )
})

Actionbar.displayName = "ActionBar"

const Root = styled.div`
  position: fixed;
  z-index: 50;
  left: 50%;
  width: 100%;
  display: flex;
  align-items: center;
  transform: translate(-50%, -100%);
  padding: 0 20px;
  
  height: 60px;
  max-width: 400px;

  ${Breakpoint} {
    height: 60px;
    max-width: 1000px;
  }
`

export default Actionbar
