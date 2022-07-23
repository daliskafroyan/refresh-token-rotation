# Refresh Token Rotation

Exercise of how authentication flow works in frontend

# Background

To access certain features in the system, the users visiting our sites are required to sign in. The frontends of the system are typically built as **Single Page Application**s (SPAs). Authentication is handled the same way in all of our SPAs: the user session is constantly validated by calling the **Authorization Server** (AS).

A common method of authentication is [Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation), which is an extension of the [PKCE](https://www.oauth.com/oauth2-servers/pkce/) flow. The flow is as follows:

1. The SPA generates a pair of `code_challenge` and `code_verifier` values, and saves the `code_verifier` in a secure cookie.
2. The SPA redirects to the `/auhorize` URL of the AS.
3. The AS validates the request, generates a `code` and redirects the user back to the SPA.
4. The SPA uses the received `code` and the saved `code_verifier` from the cookie to exchange them for a pair of tokens: one **Refresh Token** (RT) and one **Access Token** (AT).
5. The access token (AT) is used to authenticate requests towards other servers. The refresh token (RT) is stored in localStorage.
6. When the AT expiry is near, the RT is used to exchange for a new pair of tokens: one new AT and one new RT. The old pair of AT & RT are replaced by the new ones.

## Tech Stack

[Next.js](https://nextjs.org/) for main stack and [Cypress](https://www.cypress.io/) for E2E testing

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn run dev
```

Start the E2E test

```bash
  yarn run cypress:run
```
