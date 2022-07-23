import api from '@/lib/api';

const baseUrl = 'http://ascenda-auth.mocklab.io/';

export interface ICodeTokenExchangePayload {
  grant_type: string;
  code: string;
  code_verifier: string;
}

export interface ITokenTokenExchangePayload {
  grant_type: string;
  refresh_token: string;
}

export interface ICodeTokenExchangeResponse {
  expires_at: string;
  refresh_token: string;
  access_token: string;
}

export const postTokenExchange = (payload: unknown) => {
  return api.post<ICodeTokenExchangeResponse>('oauth/token', payload, {
    baseURL: baseUrl,
  });
};
