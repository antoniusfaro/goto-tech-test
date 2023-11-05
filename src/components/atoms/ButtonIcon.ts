import styled from "@emotion/styled";
import Button from "./Button";

interface Props {
  size?: "small" | "medium" | "large";
}

const buttonSize = {
  small: "2rem",
  medium: "3rem", 
  large: "4rem",
}

const ButtonIcon = styled(Button)<Props>`
  width: ${({ size }) => buttonSize[size || "medium"]};
  height: ${({ size }) => buttonSize[size || "medium"]};
  padding: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export default ButtonIcon;

export type { Props as ButtonIconProps };
