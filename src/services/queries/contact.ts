import { TypedDocumentNode, gql, } from "@apollo/client";
import { Contact, Data, QueryVariables } from "../types/contact";

export const GET_CONTACT_LIST: TypedDocumentNode<Data, QueryVariables> = gql`
query GetContactList (
  $distinct_on: [contact_select_column!], 
  $limit: Int, 
  $offset: Int, 
  $order_by: [contact_order_by!], 
  $where: contact_bool_exp
) {
  contacts: contact (
    distinct_on: $distinct_on, 
    limit: $limit, 
    offset: $offset, 
    order_by: $order_by, 
    where: $where
) {
    created_at
    first_name
    id
    last_name
    phones {
      number
    }
  }
  metadata: contact_aggregate (where: $where) {
    aggregate {
      count
    }
	}
}`;


export const GET_CONTACT_DETAIL: TypedDocumentNode<{ contact: Contact }, { id: number }> = gql`
  query GetContactDetail($id: Int!){
    contact: contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`;
