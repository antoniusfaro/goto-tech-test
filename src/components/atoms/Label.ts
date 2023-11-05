import styled from "@emotion/styled";

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  transition: var(--transition);

  &.error {
    color: var(--red);
  }
`

export default Label;