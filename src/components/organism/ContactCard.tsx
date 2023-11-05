import { FC, useState } from "react"
import styled from "@emotion/styled"
import TextMuted from "../atoms/SubText"
import Avatar from "../atoms/Avatar"
import { NavLink, useNavigate } from "react-router-dom"
import Container from "../atoms/Container"
import { Flex } from "../atoms/Flex"
import PencilIcon from "../../icons/PencilIcon"
import { css } from "@emotion/css"
import TrashIcon from "../../icons/TrashIcon"
import ModalDelete from "./ModalDelete"
import { useMutation } from "@apollo/client"
import { useNotification } from "../../providers/NotificationProvider"
import { useContact } from "../../providers/ContactProvider"
import StarIcon from "../../icons/StarIcon"
import { Contact } from "../../services/types/contact"
import { DELETE_CONTACT } from "../../services/mutation/contact"
import { GET_CONTACT_LIST } from "../../services/queries/contact"

interface Props {
  contact: Contact
}

const ContactCardStyled = styled(Container)`
  display: flex; 
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  width: 100%;
  border-bottom: 1px solid var(--gray-light);
  border-radius: 0.75rem;
  margin-top: 0.5rem;
  transition: var(--transition);

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow);
      background-color: var(--green-light);
    }
  }

  &:first-of-type {
    border-top: 1px solid var(--gray-light);
  }

  .content {
    flex-grow: 1;
    display: flex;
    gap: 0.75rem;
    align-items: center;

    .info {
      max-width: 90%;
      display: grid;
      gap: 0.5rem;

      .full-name {
        font-size: 1rem;
        font-weight: 600;
      }
    
      .phones {
        max-width: 100%;
        color: var(--primary);
        font-size: 0.8rem;
      }
      
      .full-name, .phones {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1;
      }
    }
  }
`;

const ContactCard: FC<Props> = ({ contact }) => {
  const { addNotification } = useNotification()
  const { setFavorite, deleteContact: deleteLocalContact } = useContact()
  const navigate = useNavigate()
  const fullName = `${contact.first_name} ${contact.last_name}`
  const phones = contact.phones.map((phone) => phone.number).join(", ")
  const avatarInitial = `${contact?.first_name[0] || ""}${contact?.last_name[0] || ""}`.toUpperCase()

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    refetchQueries: [
      GET_CONTACT_LIST,
      "GetContactList"
    ]
  })

  const [deleteProps, setDeleteProps] = useState<{ onConfirm?: () => void, isOpen: boolean, }>({
    isOpen: false,
    onConfirm: undefined
  })

  const handleDeleteContact = (id: number) => {
    deleteContact({
      variables: { id: Number(id) }
    }).then(() => {
      setDeleteProps({ onConfirm: undefined, isOpen: false })
      addNotification({
        message: "Contact deleted successfully",
        type: "success"
      })
      deleteLocalContact(id)
    }).catch(() => {
      addNotification({
        message: "Failed to delete contact",
        type: "error"
      })
    })
  }

  const handleDelete = (id: number) => {
    setDeleteProps({
      isOpen: true,
      onConfirm: () => handleDeleteContact(id)
    })
  }

  const handleCloseDelete = () => {
    setDeleteProps({ onConfirm: undefined, isOpen: false })
  }

  const handleAddFavorite = (favorite: boolean) => {
    setFavorite(contact, favorite)
    addNotification({
      message: `Contact ${favorite ? "added to" : "removed from"} favorite`,
      type: favorite ? "success" : "warning"
    })
  }

  return (
    <>
      <ContactCardStyled>
        <NavLink className="content" to={`/form?id=${contact.id}`}>
          <Avatar size="extraLarge">
            {avatarInitial}
          </Avatar>
          <div className="info">
            <h3 className="full-name">
              {fullName}
            </h3>
            <TextMuted className="phones">
              {phones || "No phone number"}
            </TextMuted>
          </div>
        </NavLink>
        <div className={css({ display: "flex", gap: "0.5rem" })}>
          <Flex className={css({ gap: "0.5rem !important", cursor: "pointer", color: "var(--primary)" })} onClick={() => navigate(`/form?id=${contact.id}`)}>
            <PencilIcon width={24} />
          </Flex>
          <Flex className={css({ gap: "0.5rem !important", color: "var(--red-dark)", cursor: "pointer" })}  onClick={() => handleDelete(contact.id)}>
            <TrashIcon width={24} />
          </Flex>
          <div className={css({ color: !contact.favorite ? "var(--gray)" : "var(--yellow-dark)", transform: "translateY(2px)", cursor: "pointer" })} onClick={() => handleAddFavorite(!contact.favorite)}>
            <StarIcon width={24} />
          </div>
        </div>
      </ContactCardStyled>

      <ModalDelete
        isOpen={deleteProps?.isOpen}
        onClose={() => handleCloseDelete()}
        message="Are you sure want to delete this contact?"
        onConfirm={deleteProps?.onConfirm}
      />
    </>
  )
}

export default ContactCard;
