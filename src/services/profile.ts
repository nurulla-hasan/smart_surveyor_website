/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from '@/lib/fetcher';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

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
      // Update the accessToken cookie with new data
      const newAccessToken = result?.data?.accessToken;
      if (newAccessToken) {
        const cookieStore = await cookies();
        cookieStore.set('accessToken', newAccessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }
      
      updateTag('profile');
    }
    
    return result;
  } catch (error: any) {
    console.error('Update Profile Service Error:', error);
    return { success: false, message: error?.message };
  }
};
