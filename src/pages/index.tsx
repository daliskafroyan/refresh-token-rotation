import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { ERROR, IDLE, PENDING, SUCCESS } from '@/lib/constants/apiStatus';
import { useApiStatus } from '@/lib/hooks/useApiStatus';
import { generateCode } from '@/lib/security/pkceGenerator';
import { withAsync } from '@/lib/withAsync';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import LazySpinner from '@/components/LazySpinner';

import {
  ICodeTokenExchangePayload,
  ICodeTokenExchangeResponse,
  ITokenTokenExchangePayload,
  postTokenExchange,
} from '@/api/authApi';

// current cookie and local storage

const usePostAuth = () => {
  const [auth, setAuth] = useState<ICodeTokenExchangeResponse>();
  const {
    status: postAuthStatus,
    setStatus: setPostAuthStatus,
    isIdle: isPostAuthStatusIdle,
    isPending: isPostAuthStatusPending,
    isError: isPostAuthStatusError,
    isSuccess: isPostAuthStatusSuccess,
  } = useApiStatus(IDLE);

  const initPostAuth = async (
    payload: ICodeTokenExchangePayload | ITokenTokenExchangePayload
  ) => {
    setPostAuthStatus(PENDING);
    const { response, error } = await withAsync(() =>
      postTokenExchange(payload)
    );

    if (error) {
      setPostAuthStatus(ERROR);
    } else if (response) {
      setPostAuthStatus(SUCCESS);
      setAuth(response.data);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
  };

  return {
    auth,
    postAuthStatus,
    initPostAuth,
    isPostAuthStatusIdle,
    isPostAuthStatusPending,
    isPostAuthStatusError,
    isPostAuthStatusSuccess,
  };
};

function getAuthCookieValue() {
  const cookie_list = Object.fromEntries(
    document.cookie
      .split('; ')
      .map((v) => v.split(/=(.*)/s).map(decodeURIComponent))
  );
  const filtered_cookie = Object.keys(cookie_list).filter((key) =>
    /app.txs./g.test(key)
  );

  const cookie_value = cookie_list[filtered_cookie[0]];
  const cookie_key = filtered_cookie[0];

  return [cookie_key, cookie_value];
}

function deleteCookie(name: string): void {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export default function HomePage() {
  const router = useRouter();

  const [codeChallenge, setCodeChallenge] = useState<string>();
  const [codeVerifier, setCodeVerifier] = useState<string>();

  const {
    auth,
    initPostAuth,
    isPostAuthStatusPending,
    isPostAuthStatusError,
    isPostAuthStatusSuccess,
  } = usePostAuth();

  useEffect(() => {
    if (
      router?.query?.code &&
      router?.query?.state &&
      /app\.txs\./g.test(document.cookie)
    ) {
      const [cookie_key, cookie_value] = getAuthCookieValue();
      deleteCookie(cookie_key);
      initPostAuth({
        grant_type: 'authorization_code',
        code: router?.query?.code[0],
        code_verifier: cookie_value,
      });
      window.history.replaceState(null, '', window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.code && router?.query?.state]);

  useEffect(() => {
    // to check at the app initiation whether refresh_token exist in local storage
    // if exist, initiate request to auth server
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      initPostAuth({
        grant_type: 'authorization_code',
        refresh_token: refresh_token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCodeVeriefierToCookie = (state: string, code_verifier: string) => {
    document.cookie = `app.txs.${state}=${code_verifier}; SameSite=Strict; Secure`;
  };

  const setCode = async () => {
    const [code_challenge, code_verifier, state] = generateCode();
    setCodeChallenge(await code_challenge);
    setCodeVerifier(await code_verifier);

    setCodeVeriefierToCookie(await state, await code_verifier);

    const redirectHref = {
      response_type: 'code,id_token',
      redirect_uri: 'http://localhost:3000',
    };

    window.location.href = `http://ascenda-auth.mocklab.io/authorize?state=${state}&redirect_uri=${
      redirectHref.redirect_uri
    }&response_type=${
      redirectHref.response_type
    }&code_challenge=${await code_challenge}`;
  };

  return (
    <Layout>
      <main>
        <section className='center flex h-screen flex-col items-center justify-center bg-white'>
          <div className='flex h-auto w-80 flex-col justify-between rounded shadow-lg'>
            <div className='flex items-center justify-center'>
              <LazySpinner show={isPostAuthStatusPending} />
            </div>
            {isPostAuthStatusError ? <p>There was a problem</p> : null}
            {isPostAuthStatusSuccess ? (
              <form className='m-4 flex flex-col gap-3'>
                <div>
                  <label
                    className='mb-2 block text-sm font-bold text-gray-700'
                    htmlFor='refresh-token'
                  >
                    refresh_token
                  </label>
                  <textarea
                    className='block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 px-4 leading-normal focus:outline-none'
                    id='refresh-token'
                    value={auth?.refresh_token}
                    disabled
                  />
                </div>
                <div>
                  <label
                    className='mb-2 block text-sm font-bold text-gray-700'
                    htmlFor='access-token'
                  >
                    access_token
                  </label>
                  <textarea
                    className='block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 px-4 leading-normal focus:outline-none'
                    id='access-token'
                    value={auth?.access_token}
                    disabled
                  />
                </div>
              </form>
            ) : null}
            {auth || isPostAuthStatusPending ? null : (
              <form className='m-4 flex flex-col gap-3'>
                <div>
                  <label
                    className='mb-2 block text-sm font-bold text-gray-700'
                    htmlFor='code-challenge'
                  >
                    code_challenge
                  </label>
                  <textarea
                    className='block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 px-4 leading-normal focus:outline-none'
                    id='code-challenge'
                    value={codeChallenge}
                    disabled
                  />
                </div>
                <div>
                  <label
                    className='mb-2 block text-sm font-bold text-gray-700'
                    htmlFor='code-verifier'
                  >
                    code_verifier
                  </label>
                  <textarea
                    className='block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 px-4 leading-normal focus:outline-none'
                    id='code-verifier'
                    value={codeVerifier}
                    disabled
                  />
                </div>
              </form>
            )}
            <div className='m-4 flex justify-center'>
              {isPostAuthStatusSuccess ? (
                <Button disabled>Logged in!</Button>
              ) : (
                <Button onClick={() => setCode()}>Login</Button>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
