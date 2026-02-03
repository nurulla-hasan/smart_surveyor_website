/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Phone, MapPin, Building2, Award, Briefcase } from "lucide-react";
import PageHeader from "@/components/ui/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileModal } from "@/components/settings/edit-profile-modal";
import { ChangePasswordModal } from "@/components/settings/change-password-modal";
import { getProfile } from "@/services/profile";

export const metadata = {
  title: "সেটিংস | Smart Surveyor",
  description: "আপনার প্রোফাইল এবং সিকিউরিটি সেটিংস পরিচালনা করুন।",
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | undefined }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
    <div className="p-2 rounded-md bg-primary/10 text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-semibold">{value || 'N/A'}</p>
    </div>
  </div>
);

export default async function SettingsPage() {
  const profileRes = await getProfile();
  const profileData = profileRes?.data;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="সেটিংস" 
        description="আপনার প্রোফাইল এবং সিকিউরিটি সেটিংস পরিচালনা করুন।"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarImage src={profileData?.profileImage} />
                <AvatarFallback className="text-2xl font-bold">
                  {profileData?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl font-black uppercase tracking-tighter">{profileData?.name}</CardTitle>
            <CardDescription>{profileData?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border italic text-sm text-center">
              &quot;{profileData?.bio || 'আপনার বায়ো এখনো যুক্ত করা হয়নি।'}&quot;
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <EditProfileModal profileData={profileData} />
              <ChangePasswordModal />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              ব্যক্তিগত ও পেশাদার তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="ইমেইল" value={profileData?.email} />
              <InfoItem icon={Phone} label="ফোন নম্বর" value={profileData?.phone} />
              <InfoItem icon={Building2} label="কোম্পানি" value={profileData?.companyName} />
              <InfoItem icon={Award} label="লাইসেন্স নম্বর" value={profileData?.licenseNo} />
              <InfoItem icon={Briefcase} label="অভিজ্ঞতা" value={profileData?.experience ? `${profileData.experience} বছর` : undefined} />
              <InfoItem icon={MapPin} label="অবস্থান" value={profileData?.location} />
            </div>
            <div className="mt-4 p-4 rounded-lg border bg-card/50">
              <p className="text-xs text-muted-foreground font-medium mb-1">ঠিকানা</p>
              <p className="text-sm font-semibold">{profileData?.address || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
