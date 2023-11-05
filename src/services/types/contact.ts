interface Phone {
  number: string;
}

export interface AddContactTypeWithPhonesType {
  first_name: string;
  last_name: string;
  phones: Phone[];
}

export interface UpdateContactType {
  id: number;
  _set: {
    first_name?: string;
    last_name?: string;
    phones?: Phone[];
  }
}

export interface QueryVariables {
  limit?: number;
  offset?: number;
  total?: number;
  where?: any;
  order_by?: any;
}

export interface Contact {
  created_at?: string;
  first_name: string;
  id: number;
  last_name: string;
  phones: Phone[];
  favorite?: boolean;
}

export interface Data {
  contacts: Contact[];
  metadata: {
    aggregate: {
      count: number;
    }
  }
}
