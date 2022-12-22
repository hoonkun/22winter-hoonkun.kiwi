import React from "react";
import styled from "@emotion/styled";
import MaterialIcon from "../MaterialIcon";

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
  width: 100%;
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transform: translateY(-60px);
`

export default Actionbar
