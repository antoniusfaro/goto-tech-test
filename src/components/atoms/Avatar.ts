import styled from "@emotion/styled";

interface Props {
  size?: "small" | "medium" | "large" | "extraLarge" | "superLarge";
}

const avatarSize = {
  small: "2rem",
  medium: "2.5rem", 
  large: "3rem",
  extraLarge: "4rem",
  superLarge: "8rem"
}

const Avatar = styled.div<Props>`
  width: ${({ size }) => avatarSize[size || "medium"]};
  height: ${({ size }) => avatarSize[size || "medium"]};
  padding: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc(${({ size }) => avatarSize[size || "medium"]} / 2.5);
  transition: background-color 0.3s ease-in-out;
  background-color: var(--primary);
  color: var(--white);
  flex-shrink: 0;
  font-weight: 700;
`;

export default Avatar;