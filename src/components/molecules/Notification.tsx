import styled from "@emotion/styled";
import { FC } from "react";
import Text from "../atoms/Text";

interface Props {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const colors = {
  success: "#9cff95",
  error: "#ffbfbf",
  warning: "#ffebb1",
  info: "#8ee3ff",
}

const Notification: FC<Props> = ({ message, type }) => {
  return (
    <NotificationStyled
      type={type}
    >
      <Text.H3 className="type">{type}</Text.H3>
      <Text.P>{message}</Text.P>
    </NotificationStyled>
  )
}

export default Notification

interface NotificationStyledProps {
  type: 'success' | 'error' | 'warning' | 'info';
}

const NotificationStyled = styled.div<NotificationStyledProps>`
  width: 18rem;
  padding: 0.75rem;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => colors[props.type]};
  color: #000;
  box-shadow: var(--shadow);
  animation: slideIn 0.5s ease-in-out;
  border-radius: var(--radius);
  @keyframes slideIn {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .type {
    margin-bottom: 0.5rem;
    text-transform: capitalize;
  }
`