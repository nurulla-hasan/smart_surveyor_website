import { getProfile } from "@/services/profile";
import { SettingsView } from "@/components/settings/settings-view";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "সেটিংস | Smart Surveyor",
  description: "আপনার প্রোফাইল এবং সিকিউরিটি সেটিংস পরিচালনা করুন।",
};

export default async function SettingsPage() {
  const profileRes = await getProfile();
  
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsView profileData={profileRes?.data} />
    </Suspense>
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-50" />
        <Skeleton className="h-4 w-75" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-50" />
        <Skeleton className="h-100 w-full" />
      </div>
    </div>
  );
}
