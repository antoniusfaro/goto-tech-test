import { TypedDocumentNode, gql } from "@apollo/client";
import { QueryVariables } from "../types/contact";

export const SUBSCRIBE_CONTACT_LIST: TypedDocumentNode<any, QueryVariables> = gql`
  subscription SubscribeContactList (
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
  }
`;
