আমি আপনার রিকোয়ারমেন্ট এবং পেইলড স্ট্রাকচার অনুযায়ী রিপোর্ট তৈরির কাজটা সম্পন্ন করব।

### ১. বুকিং টাইপ ও সার্ভিস আপডেট (Booking Types & Service)
**ফাইল:** `src/types/bookings.ts` ও `src/services/bookings.ts`
- `Booking` টাইপ আপডেট করব যাতে `savedMaps` এবং `calculations` এর ডাটা থাকে।
- `getBookingById(id)` ফাংশন যোগ করব যাতে একটি বুকিংয়ের সব ডিটেইলস (ম্যাপ ও ক্যালকুলেশন সহ) আনা যায়।

### ২. রিপোর্ট পেজ আপডেট (Create Report View)
**ফাইল:** `src/components/reports/create-report-view.tsx`
- **ফাইল আপলোড:** ফর্মে একটি ফাইল ইনপুট যোগ করব যাতে আপনি "Survey Map" বা "PDF" আপলোড করতে পারেন (`reportFile`)।
- **অটো-ফিল (Auto-fill):**
  - যখন বুকিং সিলেক্ট করবেন, তখন `getBookingById` কল করে ডাটা আনব।
  - `savedMaps` বা `calculations` থেকে `areaSqFt`, `areaDecimal` ডাটা নিয়ে অটোমেটিক ফর্মে বসিয়ে দেব।
- **ফর্ম সাবমিশন (Payload):**
  - সাবমিটের সময় ডাটাগুলো `FormData` হিসেবে সাজাব।
  - `reportFile` টি ফাইল হিসেবে এবং বাকি সব তথ্য `data` নামে একটি JSON স্ট্রিং হিসেবে পাঠাব (আপনার স্ক্রিনশট অনুযায়ী)।

### ৩. চেকিং (Verification)
- বুকিং সিলেক্ট করলে ডাটা ঠিকঠাক অটো-ফিল হচ্ছে কিনা দেখব।
- সার্ভারে পেইলড ঠিকমতো `multipart/form-data` হিসেবে যাচ্ছে কিনা নিশ্চিত করব।