import { client } from '.';
import { User } from './types';

export const getProfile = async () => {
  try {
    const response = await client.get<User>('/api/v1/auth/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const postLogout = async () => {
  await client.post('/api/v1/auth/logout');
};
