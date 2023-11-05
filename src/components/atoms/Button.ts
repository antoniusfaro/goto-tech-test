import styled from "@emotion/styled";

interface Props {
  bg?: "primary" | "transparent" | "white" | "black" | "red" | "gray" | "gray-light" | "yellow" | "green";
  width?: string | number;
  height?: string | number;
  color?: "primary" | "black" | "white" | "red" | "gray" | "gray-light" | "yellow" | "green";
}

const Button = styled.button<Props>`
  background-color: var(--${({ bg }) => bg ? bg : "primary"});
  color: var(--${({ color }) => color ? color : "white"});
  border: none;
  border-radius: 10rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  height: ${({ height }) => height ? height : "2.5rem"};
  width: ${({ width }) => width ? width : "auto"};
  transition: var(--transition);
  padding: 0 1rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:hover {
      filter: brightness(0.95);
    }
  }

  &:active {
    filter: brightness(0.9);
  }
`

export default Button;

export type { Props as ButtonProps };