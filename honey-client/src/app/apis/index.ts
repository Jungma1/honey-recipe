import axios from 'axios';

const createClient = () => {
  const _client = axios.create({
    withCredentials: true,
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  return _client;
};

export const client = createClient();
