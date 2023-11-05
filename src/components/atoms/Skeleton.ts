import styled from "@emotion/styled";

interface Props {
  rounded?: boolean;
  width?: string;
  height?: string;
}

const Skeleton = styled.div<Props>`
  background-color: #ddd;
  border-radius: ${props => props.rounded ? '50%' : '0'};
  width: ${props => props.width ? props.width : '100%'};
  height: ${props => props.height ? props.height : '1rem'};
  margin-bottom: 0.5rem;
`

export default Skeleton;