/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getNewAccessToken, logOut } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

// ১. Token Expired চেক করার জন্য উন্নত ফাংশন
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // টোকেন শেষ হওয়ার ৩০ সেকেন্ড আগেই সেটাকে expired হিসেবে ধরা ভালো (Buffer time)
    return decoded.exp < currentTime + 30;
  } catch (err: any) {
    return true;
  }
};

// ২. মেইন ফাংশন যা সার্ভার অ্যাকশন এবং সার্ভার কম্পোনেন্ট উভয় জায়গায় কাজ করবে
export const getValidAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // যদি অ্যাক্সেস টোকেন না থাকে বা মেয়াদ শেষ হয়ে যায়
  if (!accessToken || isTokenExpired(accessToken)) {
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      // রিফ্রেশ টোকেন না থাকলে লগআউট করে দেওয়া নিরাপদ
      await logOut();
      return null;
    }

    try {
      // নতুন অ্যাক্সেস টোকেন আনা হচ্ছে
      const response = await getNewAccessToken(refreshToken);
      const newAccessToken = response?.data?.accessToken;

      if (!newAccessToken) {
        await logOut();
        return null;
      }

      // মনে রাখবেন: cookies().set() শুধুমাত্র Server Actions বা Route Handlers-এ কাজ করে।
      // Server Components-এ এটি সরাসরি কাজ করবে না। 
      try {
        cookieStore.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      } catch (cookieError) {
        // Server Component থেকে কল করলে এখানে এরর আসতে পারে, যা ইগনোর করা যায় 
        // কারণ টোকেনটি ভেরিয়েবলে রিটার্ন করা হচ্ছে।
      }

      return newAccessToken;
    } catch (error) {
      await logOut();
      return null;
    }
  }

  return accessToken;
};