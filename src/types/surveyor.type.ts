export interface Surveyor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  licenseNo?: string;
  experience?: string | number;
  rating?: number;
  totalReviews?: number;
  location?: string;
  profileImage?: string;
  bio?: string;
  role?: string;
  _id?: string; // For compatibility if needed
}