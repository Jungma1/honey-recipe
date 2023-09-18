import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

const createClient = () => {
  const _client = axios.create({
    withCredentials: true,
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  _client.interceptors.response.use(
    (response) => response,
    (error) => error.response
  );
  return _client;
};

export const client = createClient();

export const withSSR = async <T>(fn: () => Promise<T>, context: GetServerSidePropsContext) => {
  client.defaults.headers['Authorization'] = '';

  let currentAccessToken = context.req.cookies['access_token'];

  if (!currentAccessToken) {
    const currentRefreshToken = context.req.cookies['refresh_token'];
    if (!currentRefreshToken) return fn();

    try {
      const response = await client.post('/api/v1/auth/refresh', null, {
        headers: {
          Authorization: `Bearer ${currentRefreshToken}`,
        },
      });
      const { accessToken, refreshToken } = response.data;
      const date = new Date();
      const accessTokenExpires = new Date(date.getTime() + 60 * 60 * 1000);
      const refreshTokenExpires = new Date(date.getTime() + 60 * 60 * 1000 * 7 * 24);
      context.res.setHeader('Set-Cookie', [
        `access_token=${accessToken}; path=/; expires=${accessTokenExpires.toUTCString()}; httpOnly`,
        `refresh_token=${refreshToken}; path=/; expires=${refreshTokenExpires.toUTCString()}; httpOnly`,
      ]);
      currentAccessToken = accessToken;
    } catch (error) {
      return fn();
    }
  }

  if (currentAccessToken) {
    client.defaults.headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }

  return fn();
};
