import { FC } from "react"
import styled from "@emotion/styled"

interface Props {
  title: string
}

const PageTitle: FC<Props> = ({ title }) => {
  return (
    <PageTitleStyled>
      {title}
    </PageTitleStyled>
  )
}

export default PageTitle

const PageTitleStyled = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`