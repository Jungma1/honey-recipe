import axios from 'axios';
import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

type AsyncFn<T> = () => Promise<T>;
type Context = GetServerSidePropsContext<ParsedUrlQuery, PreviewData>;

const setClientCookie = (context: Context) => {
  const accessToken = context.req.cookies['access_token'];
  if (accessToken) {
    client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }
};

export const withClientCookie = async <T>(fn: AsyncFn<T>, context: Context) => {
  setClientCookie(context);
  const result = await fn();
  return result;
};
