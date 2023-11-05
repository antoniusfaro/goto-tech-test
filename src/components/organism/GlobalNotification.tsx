import styled from "@emotion/styled"
import { useNotification } from "../../providers/NotificationProvider"
import Notification from "../molecules/Notification"
import { FC, useEffect, useState } from "react"
import { css } from "@emotion/css"

const GlobalNotification = () => {
  const { notifications } = useNotification()

  return (
    <GlobalNotificationStyled>
      {notifications.map((notification) => (
        <AutoCloseNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          id={notification.id}
        />
      ))}
    </GlobalNotificationStyled>
  )
}

export default GlobalNotification

const GlobalNotificationStyled = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
`

interface AutoCloseNotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id: string;
}

const notificationDuration = 3000

const AutoCloseNotification: FC<AutoCloseNotificationProps> = ({ message, type, id }) => {
  const [show, setShow] = useState<boolean>(true)
  const { removeNotification } = useNotification()

  const handleClose = () => {
    setShow(false)

    setTimeout(() => {
      removeNotification(id)
    }, 500)
  }

  useEffect(() => {
    const remainingTime = new Date(id).getTime() + notificationDuration - new Date().getTime()
    const timer = setTimeout(() => {
      handleClose()
    }, remainingTime)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (!show) {
    return null
  }

  return (
    <div onClick={handleClose} className={css({ marginBottom: '1rem' })}  >
      <Notification
        message={message}
        type={type}
      />
    </div >
  )

}