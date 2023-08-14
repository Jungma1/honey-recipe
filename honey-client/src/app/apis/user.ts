import { client } from '.';
import { ImageUploadResponse, User } from './types';

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

export const patchProfilePicture = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await client.patch<ImageUploadResponse>('/api/v1/users/picture', formData);
  return response.data;
};
