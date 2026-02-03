/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from '@/lib/fetcher';

export const getProfile = async (): Promise<any> => {
  try {
    const result = await serverFetch('/users/profile', {
      method: 'GET',
    });
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

export const updateProfile = async (formData: FormData): Promise<any> => {
  try {
    const result = await serverFetch('/users/profile', {
      method: 'PUT',
      body: formData,
      // Note: serverFetch might need adjustment for FormData if it stringifies body
    });
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};
