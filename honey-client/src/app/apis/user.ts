import { client } from '.';
import { ImageUploadResponse, User, UserUpdateRequest } from './types';

export const getProfile = async () => {
  try {
    const response = await client.get<User>('/api/v1/auth/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const patchProfile = async ({ request }: { request: UserUpdateRequest }) => {
  const response = await client.patch<User>('/api/v1/users', request);
  return response.data;
};

export const postLogout = async () => {
  await client.post('/api/v1/auth/logout');
};

export const deleteProfileImage = async () => {
  const response = await client.delete('/api/v1/users/picture');
  return response.data;
};

export const patchProfileImage = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await client.patch<ImageUploadResponse>('/api/v1/users/picture', formData);
  return response.data;
};
