import { encode as base64encode } from 'base64-arraybuffer';

const generateRandomString = (length: number): string => {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateCodeVerifier = () => {
  const code_verifier = generateRandomString(43);
  return code_verifier;
};

const generateCodeChallenge = async (code_verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64Digest = base64encode(digest)
    .replace(/[A-Z]/g, generateRandomString(1))
    .replace(/\+/g, generateRandomString(1))
    .replace(/\//g, generateRandomString(1))
    .replace(/\\/g, generateRandomString(1))
    .replace(/=/g, generateRandomString(1));
  return base64Digest;
};

export const generateCode = () => {
  const code_verifier = generateCodeVerifier();
  const code_challenge = generateCodeChallenge(code_verifier);
  const random_string = generateRandomString(20);
  return [code_challenge, code_verifier, random_string];
};
