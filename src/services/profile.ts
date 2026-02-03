/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from '@/lib/fetcher';
import { updateTag } from 'next/cache';

export const getProfile = async (): Promise<any> => {
  try {
    const result = await serverFetch('/users/profile', {
      method: 'GET',
      next: { tags: ['profile'] }
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
    });
    
    if (result?.success) {
      updateTag('profile');
    }
    
    return result;
  } catch (error: any) {
    console.error('Update Profile Service Error:', error);
    return { success: false, message: error?.message };
  }
};
