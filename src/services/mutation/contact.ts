import { TypedDocumentNode, gql } from "@apollo/client";
import { AddContactTypeWithPhonesType, UpdateContactType } from "../types/contact";

export const ADD_CONTACT_WITH_PHONES: TypedDocumentNode<any, AddContactTypeWithPhonesType> = gql`
mutation AddContactWithPhones(
    $first_name: String!, 
    $last_name: String!, 
    $phones: [phone_insert_input!]!
    ) {
  insert_contact(
      objects: {
          first_name: $first_name, 
          last_name: 
          $last_name, phones: { 
              data: $phones
            }
        }
    ) {
    returning {
      first_name
      last_name
      id
      phones {
        number
      }
    }
  }
}
`;

export const EDIT_CONTACT: TypedDocumentNode<any, UpdateContactType> = gql`
  mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: {id: $id}, _set: $_set) {
      first_name
      last_name
    }
  }
`;

export const EDIT_PHONE: TypedDocumentNode<any, { pk_columns: { contact_id: number, number?: string }, new_phone_number: string }> = gql`
  mutation EditPhoneNumber($pk_columns: phone_pk_columns_input!, $new_phone_number:String!) {
    update_phone_by_pk(pk_columns: $pk_columns, _set: {number: $new_phone_number}) {
      contact {
        id
      }
    }
  }
`;

export const ADD_PHONE: TypedDocumentNode<any, { contact_id: number, phone_number: string }> = gql`
  mutation AddPhoneToContact ($contact_id: Int!, $phone_number:String!) {
    insert_phone(objects: {contact_id: $contact_id, number: $phone_number}) {
      returning {
        contact {
          id
        }
      }
    }
  }
`;

export const DELETE_CONTACT: TypedDocumentNode<any, { id: number }> = gql`
  mutation DeleteContact($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

export const DELETE_PHONE: TypedDocumentNode<any, { contact_id: number, number: string }> = gql`
  mutation DeleteNumber($contact_id: Int!, $number: String!) {
    delete_phone_by_pk(contact_id: $contact_id, number: $number) {
      contact {
        id
      }
    }
  }
`;
