import { Response } from 'express';

export function setTokenCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
  domain: string,
) {
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    path: '/',
    domain,
    maxAge: 60 * 60 * 1000,
  });
  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    path: '/',
    domain,
    maxAge: 60 * 60 * 1000 * 24 * 7,
  });
}

export function clearTokenCookies(res: Response, domain: string) {
  res.clearCookie('access_token', { domain, path: '/' });
  res.clearCookie('refresh_token', { domain, path: '/' });
}
