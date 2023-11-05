import { FC, Fragment, useMemo } from "react"
import { NavLink, useSearchParams } from "react-router-dom"

import styled from "@emotion/styled"
import { css } from "@emotion/css"

import Spinner from "../atoms/Spinner"
import Container from "../atoms/Container"
import Text from "../atoms/Text"
import FloatingActionButton from "../molecules/FloatingActionButton"
import ContactCard from "../organism/ContactCard"
import Pagination from "../organism/Pagination"

import PlusIcon from "../../icons/PlusIcon"

import { useContact } from "../../providers/ContactProvider"
import { Contact } from "../../services/types/contact"

const per_page = 10;

const ContactCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
  @media (min-width: 576px) {
    padding: 0 5rem;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ContactList: FC = () => {
  const [searchParam] = useSearchParams()
  const page = parseInt(searchParam.get("page") || "1")
  const search = searchParam.get("search") || ""

  const { getContacts, getFavoriteContacts, loading } = useContact()

  const { contacts, length } = useMemo(() => getContacts(page, search), [page, search, getContacts])
  const favoriteContacts = useMemo(() => getFavoriteContacts(), [getFavoriteContacts])

  const totalData = length || 0
  const totalPage = Math.ceil(totalData / per_page)

  const renderList = (data: Contact[], onEmpty: string) => {
    if (!data || data?.length === 0) return (
      <Container>
        <Text.P >{onEmpty}</Text.P>
      </Container>
    )

    const contactList = data.map((contact) => {
      return (
        <Fragment key={contact.id}>
          <ContactCard contact={contact} />
        </Fragment>
      )
    })

    return contactList
  }

  const renderContactList = useMemo(() => {
    return renderList(contacts, "No Contact Found")
  }, [contacts])

  const renderFavoriteContactList = useMemo(() => {
    return renderList(favoriteContacts, "No Favorite Contact Found")
  }, [favoriteContacts])

  if (loading) return <Spinner spaceY="2rem" />

  return (
    <>
      <main className={css({ marginBottom: "2rem", minHeight: "70vh" })}>
        <Container>
          <Text.H2 className={css({ margin: "1rem 0 0.5rem 0" })}>Favorites</Text.H2>
        </Container>
        <ContactCardGrid>
          {renderFavoriteContactList}
        </ContactCardGrid>
        <Container>
          <Text.H2 className={css({ margin: "1rem 0 0.5rem 0" })}>Contact List</Text.H2>
        </Container>
        <ContactCardGrid>
          {renderContactList}
        </ContactCardGrid>
      </main>
      {totalData > 0 && (
        <Pagination page={page} totalPage={totalPage} />
      )}
      <NavLink
        to="/form"
        {...{ "data-testid": "add-contact-btn" }}
      >
        <FloatingActionButton
          isIcon={true}
          position="bottom-right"
          size="large"
        >
          <PlusIcon width={36} />
        </FloatingActionButton>
      </NavLink>
    </>
  )
}

export default ContactList;
