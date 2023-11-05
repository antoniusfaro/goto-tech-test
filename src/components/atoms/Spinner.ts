import styled from "@emotion/styled";

interface Props {
  size?: string;
  spaceY?: string;
}

const Spinner = styled.div<Props>`
  border: 0.5rem solid #f3f3f3;
  border-top: 0.5rem solid #555;
  border-radius: 50%;
  width: ${(props) => props.size || "4rem"};
  height: ${(props) => props.size || "4rem"};
  animation: spin 1s linear infinite;
  margin: ${props => props.spaceY || "1rem"} auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;