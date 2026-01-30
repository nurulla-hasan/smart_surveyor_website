# BookingTabs রিফ্যাক্টর (Shadcn/UI ব্যবহার করে)

## ১. Shadcn/UI Tabs ইন্টিগ্রেশন:
- `src/components/bookings/booking-tabs.tsx` ফাইলে কাস্টম বাটন সরিয়ে `@/components/ui/tabs` ব্যবহার করা হবে।
- `TabsList` এবং `TabsTrigger` ব্যবহার করে ট্যাবগুলো সাজানো হবে।

## ২. ইউআই এবং ফাংশনালিটি বজায় রাখা:
- বর্তমানের আইকন (Calendar, List, History) এবং ব্যাজ (Request Count) সিস্টেম আগের মতোই থাকবে।
- `onTabChange` এবং `activeTab` প্রপসগুলো আগের মতোই কাজ করবে যাতে অন্য ফাইলে পরিবর্তন করতে না হয়।

বস, আমি কি এই ক্লিন-আপ কাজটা শুরু করব?