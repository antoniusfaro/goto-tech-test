import styled from "@emotion/styled"
import { FC, ReactElement, useEffect, useState } from "react"
import ButtonIcon from "../atoms/ButtonIcon"
import CloseIcon from "../../icons/CloseIcon"

const ModalSize = {
  small: "24rem",
  medium: "32rem",
  large: "40rem",
  full: "95%"
}

interface Props {
  children: ReactElement
  isOpen: boolean
  onClose: () => void
  title: string
  size?: "small" | "medium" | "large" | "full"
}

const Modal: FC<Props> = ({ children, isOpen: preIsOpen, onClose, title, size }) => {
  const [isOpen, setIsOpen] = useState(preIsOpen)

  useEffect(() => {
    if (preIsOpen) {
      setIsOpen(preIsOpen)
      document.body.style.overflow = 'hidden'
      return
    } else {
      setTimeout(() => {
        setIsOpen(preIsOpen)
      }, 300)
      document.body.style.overflow = 'unset'
      return
    }
  }, [preIsOpen])

  if (!isOpen) return null

  return (
    <ModalStyled isOpen={isOpen} preIsOpen={preIsOpen} size={size}>
      <div className="overlay">
        <div className="modal">
          <div className="header">
            <h3 className="title">
              {title}
            </h3>
            <ButtonIcon onClick={onClose} bg="transparent" color="black" size="small">
              <CloseIcon />
            </ButtonIcon>
          </div>
          <div className="body">
            {children}
          </div>
        </div>
      </div>
    </ModalStyled>
  )
}

export default Modal

interface ModalStyledProps {
  size?: "small" | "medium" | "large" | "full"
  preIsOpen: boolean
  isOpen: boolean
}

const ModalStyled = styled.div<ModalStyledProps>`
  transition: all 0.3s;
  position: fixed;
  z-index: 100;
  inset: 0;
  overflow-y: auto;
  animation: ${({ preIsOpen }) => preIsOpen ? "fade_in" : "fade_out"} 0.3s;
  animation-fill-mode: forwards;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};

  @keyframes fade_in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade_out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: ${({ size }) => size ? ModalSize[size] : ModalSize.medium};
    width: 95%;
    background-color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;

    .header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--gray-light);

      .title {
        font-size: 1.25rem;
        font-weight: 600;
      }

      .close-button {
        border: none;
        background-color: transparent;
        font-size: 1rem;
        font-weight: 600;
        color: var(--blue);
        cursor: pointer;
      }
    }

    .body {
      padding: 1rem;
    }
  }
`