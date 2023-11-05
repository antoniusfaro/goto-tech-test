/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Contact } from "../services/types/contact";
import { GET_CONTACT_LIST } from "../services/queries/contact";

const PER_PAGE = 10;

interface Action {
  type: 'SET_CONTACTS' | 'SET_FAVORITE' | 'DELETE_CONTACT' | 'UPDATE_CONTACT' | 'ADD_CONTACT'
  payload: Contact | Contact[] | number | any
}

interface ContactContext {
  loading?: boolean;
  getContacts: (page?: number, search?: string) => {contacts: Contact[], length: number};
  getFavoriteContacts: () => Contact[];
  setFavorite: (contact: Contact, favorite: boolean) => void;
  deleteContact: (id: number) => void;
  updateContact: (contact: Contact) => void;
  getContact: (id: number) => Contact | undefined;
  addContact: (contact: Contact) => void;
}

const ContactContext = createContext<ContactContext>({
  loading: false,
  getContacts: () => ({contacts: [], length: 0}),
  getFavoriteContacts: () => [],
  setFavorite: () => { },
  deleteContact: () => { },
  updateContact: () => { },
  getContact: () => undefined,
  addContact: () => { },
});

const contactReducer = (state: Contact[], action: Action) => {
  switch (action.type) {
    case "ADD_CONTACT":
      return [...state, action.payload];
    case "SET_CONTACTS":
      return action.payload;
    case "SET_FAVORITE":
      return state.map((contact) => {
        if (contact.id === action.payload.id) {
          return { ...contact, favorite: action.payload.favorite };
        }
        return contact;
      });
    case "DELETE_CONTACT":
      return state.filter((contact) => contact.id !== action.payload);
    case "UPDATE_CONTACT":
      return state.map((contact) => {
        if (contact.id === action.payload.id) {
          const newContact = action.payload
          newContact.favorite = contact.favorite || false;
          return newContact;
        }
        return contact;
      });
    default:
      return state;
  }
}

export const useContact = () => {
  return useContext(ContactContext);
};

interface Props {
  children: React.ReactNode;
}

const ContactProvider = ({ children }: Props) => {
  const getLocalContacts = () => {
    const storedContacts = localStorage.getItem("contacts");
    return storedContacts ? JSON.parse(storedContacts) : [];
  };

  const [contacts, dispatch] = React.useReducer(contactReducer, getLocalContacts());
  const [initial, setInitial] = useState<boolean>(true);

  const [getData, { loading, error }] = useLazyQuery(GET_CONTACT_LIST);

  const getContactList = () => {
    getData({
      variables: {
        order_by: {
          first_name: "asc",
          last_name: "asc",
        },
      },
      fetchPolicy: "network-only",
    })
      .then((res) => {
        const contactsData = res?.data?.contacts || [];
        const localContacts = getLocalContacts();

        const fixedContacts = contactsData.map((contact: Contact) => {
          const newContact = { ...contact };
          const currLocalContact: Contact = localContacts.find((localContact: Contact) => localContact.id === contact.id);
          if (currLocalContact && currLocalContact.favorite) {
            newContact.favorite = currLocalContact.favorite;
          } else {
            newContact.favorite = false;
          }

          return newContact;
        });

        const localContactsNotInContacts = localContacts.filter((localContact: Contact) => {
          const found = contactsData.find((contact: Contact) => contact.id === localContact.id);
          return !found;
        });

        if (fixedContacts.length > 0) {
          dispatch({ type: "SET_CONTACTS", payload: [...fixedContacts, ...localContactsNotInContacts] });
        } else {
          dispatch({ type: "SET_CONTACTS", payload: [] });
        }

      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getContactList();
    setInitial(false);
  }, []);

  useEffect(() => {
    if (!initial) {
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  const getContacts = (page: number = 1, search: string = ""): {contacts: Contact[], length: number} => {
    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const filteredContacts = contacts.filter((contact: Contact) => {
      const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
      const match = fullName.includes(search.toLowerCase());
      const isFavorite = contact.favorite;
      return match && !isFavorite;
    }); 
    const sortedContacts = filteredContacts.sort((a: Contact, b: Contact) => {
      const nameA = `${a?.first_name} ${a?.last_name}`.toLowerCase();
      const nameB = `${b?.first_name} ${b?.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    const currentPageContacts = sortedContacts.slice(start, end);

    return {
      contacts: currentPageContacts,
      length: sortedContacts.length,
    }
  };

  const getFavoriteContacts = (): Contact[] => {
    return contacts.filter((contact: Contact) => contact.favorite).sort((a: Contact, b: Contact) => {
      const nameA = `${a?.first_name} ${a?.last_name}`.toLowerCase();
      const nameB = `${b?.first_name} ${b?.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  };

  const setFavorite = (contact: Contact, favorite: boolean) => {
    dispatch({ type: "SET_FAVORITE", payload: { ...contact, favorite } });
  };

  const deleteContact = (id: number) => {
    dispatch({ type: "DELETE_CONTACT", payload: id });
  };

  const updateContact = (contact: Contact) => {
    dispatch({ type: "UPDATE_CONTACT", payload: contact });
  };

  const getContact = (id: number) => {
    return contacts.find((contact: Contact) => contact.id === id);
  };

  const addContact = (contact: Contact) => {
    dispatch({ type: "ADD_CONTACT", payload: contact });
  };

  return (
    <ContactContext.Provider
      value={{
        loading,
        getContacts,
        getFavoriteContacts,
        setFavorite,
        deleteContact,
        updateContact,
        getContact,
        addContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export default ContactProvider;