export interface User {
  [prop: string]: any;

  id?: number | string | null;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: any[];
  permissions?: any[];
}

export interface Token {
  [prop: string]: any;

  access_token: string;
  access_token_cliente: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refresh_token?: string;
  roles?: any[];

}
