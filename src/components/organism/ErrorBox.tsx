import styled from "@emotion/styled"
import Container from "../atoms/Container"
import Text from "../atoms/Text"
import { NavLink } from "react-router-dom"
import ErrorImage from "./../../assets/error-image.png"
import Button from "../atoms/Button"
import { css } from "@emotion/css"

const ErrorBox = () => {
  return (
    <ErrorBoxStyle>
      <Container className="content">
        <img src={ErrorImage} alt="Error" width="250px" className={css({marginBottom: "2rem"})} />
        <Text.H1>Something went wrong...</Text.H1>
        <Text.H2>Try to refresh the page</Text.H2>
        <Text.P className={css({margin: "1rem 0"})}>or</Text.P>
        <NavLink to="/">
          <Button>
            Back to Home
          </Button>
        </NavLink>
      </Container>
    </ErrorBoxStyle>
  )
}

export default ErrorBox

const ErrorBoxStyle = styled.div`
  text-align: center;
  margin-top: 5rem;
  display: grid;
  row-gap: 3rem;
`