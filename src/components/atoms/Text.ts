import styled from "@emotion/styled"

interface Props {
  size?: keyof typeof fontSizes
}

const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
}

const H1 = styled.h1<Props>`
  font-size: ${({ size }) => size && fontSizes[size] || fontSizes["2xl"]};
  color: var(--black);
`

const H2 = styled.h2<Props>`
  font-size: ${({ size }) => size && fontSizes[size] || fontSizes["xl"]};
  color: var(--black);
`

const H3 = styled.h3<Props>`
  font-size: ${({ size }) => size && fontSizes[size] || fontSizes["lg"]};
  color: var(--black);
`

const P = styled.p<Props>`
  font-size: ${({ size }) => size && fontSizes[size] || fontSizes["md"]};
  color: var(--black);
`

export default {
  H1,
  H2,
  H3,
  P,
}