/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { FieldValues } from 'react-hook-form';
import { serverFetch } from '@/lib/fetcher';

// SIGN IN (With Role Check)
export const signInUser = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/login', {
      method: 'POST',
      body: userData,
    });

    if (result?.success) {
      const accessToken = result?.data?.accessToken;
      const decodedData: any = jwtDecode(accessToken);

      // ROLE CHECK
      const allowedRoles = ['surveyor', 'client'];
      if (!allowedRoles.includes(decodedData?.role)) {
        return {
          success: false,
          message: "You are not authorized to access this panel!",
        };
      }

      const cookieStore = await cookies();
      cookieStore.set('accessToken', accessToken);
      cookieStore.set('refreshToken', result?.data?.refreshToken);

      // Return redirect path based on role
      return { 
        ...result, 
        redirectPath: decodedData?.role === 'client' ? '/portal' : '/dashboard' 
      };
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};

// REGISTRATION
export const registerUser = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/register', {
      method: 'POST',
      body: userData,
    });

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

// CHANGE PASSWORD
export const changePassword = async (data: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/change-password', {
      method: 'PATCH',
      body: data,
    });

    if (result?.success) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', result?.data?.accessToken);
      cookieStore.set('refreshToken', result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// GET NEW ACCESS TOKEN
export const getNewAccessToken = async (refreshToken: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    return await res.json();
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to get new token" };
  }
};

// UPDATE USER DATA
export const updateUserData = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/update-user-data', {
      method: 'PATCH',
      body: userData,
    });

    if (result?.success) {
      (await cookies()).set('accessToken', result?.data?.accessToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// GET CURRENT USER
export const getCurrentUser = async (): Promise<any> => {
  const accessToken = (await cookies()).get('accessToken')?.value;
  if (accessToken) {
    return jwtDecode(accessToken);
  }
  return null;
};

// LOGOUT
export const logOut = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
};