import { FC } from "react"
import Modal from "../molecules/Modal"
import Text from "../atoms/Text"
import { FlexJustifyEnd } from "../atoms/Flex"
import Button from "../atoms/Button"
import { css } from "@emotion/css"

interface Props {
  onClose: () => void
  onConfirm?: () => void
  message?: string
  isOpen: boolean
}

const ModalDelete: FC<Props> = ({ onClose, onConfirm, message = "Are you sure you want to delete this data?", isOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Warning">
      <div>
        <Text.P>
          {message}
        </Text.P>
        <FlexJustifyEnd className={css({ marginTop: "1.5rem" })}>
          <Button onClick={onClose} bg="gray-light" color="black">
            Cancel
          </Button>
          <Button onClick={onConfirm} bg="red" color="white">
            Delete
          </Button>
        </FlexJustifyEnd>
      </div>
    </Modal>
  )
}

export default ModalDelete