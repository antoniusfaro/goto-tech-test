import styled from "@emotion/styled"
import { FC } from "react"
import Dropdown from "../molecules/Dropdown"
import ButtonIcon from "../atoms/ButtonIcon"
import TrippleDotIcon from "../../icons/TrippleDotIcon"
import PhoneIcon from "../../icons/PhoneIcon"
import Text from "../atoms/Text"

interface Props {
  number: string
  onEdit: () => void
  onDelete: () => void
}

const PhoneCard: FC<Props> = ({ number, onDelete, onEdit }) => {
  return (
    <PhoneCardStyled>
      <div className="content">
        <div className="icon">
          <PhoneIcon />
        </div>
        <Text.P className="number">
          {number}
        </Text.P>
      </div>
      <div className="action">
        <Dropdown
          menu={[{
            label: "Edit",
            onClick: onEdit
          }, {
            label: "Delete",
            onClick: onDelete
          }]}
          trigger={
            <ButtonIcon bg="white" color="black" size="small">
              <TrippleDotIcon />
            </ButtonIcon>
          }
        />
      </div>
    </PhoneCardStyled>
  )
}

export default PhoneCard

const PhoneCardStyled = styled.div`
  display: flex;
  padding: 0.5rem 0;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-light);
  max-width: 100%;

  & > .content {
    display: flex;
    align-items: center;
    flex: 1;
    width: 90%;
    gap: 1rem;

    & > .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    & > .number {
      width: 88%;
      overflow-wrap: break-word;
    }
  }
`

