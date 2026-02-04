/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Phone, MapPin, Building2, Award, Briefcase } from "lucide-react";
import PageHeader from "@/components/ui/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileModal } from "@/components/settings/edit-profile-modal";
import { ChangePasswordModal } from "@/components/settings/change-password-modal";
import { getCurrentUser } from "@/services/auth";
import { getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings | Smart Surveyor",
  description: "Manage your profile and security settings.",
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
  const profileData = await getCurrentUser();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your profile and security settings."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarImage src={profileData?.profileImage} />
                <AvatarFallback className="text-2xl font-bold">
                  {getInitials(profileData?.name) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl uppercase">{profileData?.name}</CardTitle>
            <CardDescription>{profileData?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border italic text-sm text-center">
              &quot;{profileData?.bio || 'Your bio has not been added yet.'}&quot;
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
            <CardTitle className="text-lg uppercase tracking-wide flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Personal & Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={profileData?.email} />
              <InfoItem icon={Phone} label="Phone Number" value={profileData?.phone} />
              <InfoItem icon={Building2} label="Company" value={profileData?.companyName} />
              <InfoItem icon={Award} label="License Number" value={profileData?.licenseNo} />
              <InfoItem icon={Briefcase} label="Experience" value={profileData?.experience ? `${profileData.experience} years` : undefined} />
              <InfoItem icon={MapPin} label="Location" value={profileData?.location} />
            </div>
            <div className="mt-4 p-4 rounded-lg border bg-card/50">
              <p className="text-xs text-muted-foreground font-medium mb-1">Address</p>
              <p className="text-sm font-semibold">{profileData?.address || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
