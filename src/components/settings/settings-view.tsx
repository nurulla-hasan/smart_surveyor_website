/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { User, Lock } from "lucide-react";
import PageHeader from "../ui/custom/page-header";

export function SettingsView({ profileData }: { profileData: any }) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader 
        title="সেটিংস" 
        description="আপনার প্রোফাইল এবং সিকিউরিটি সেটিংস পরিচালনা করুন।"
      />
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            প্রোফাইল
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            সিকিউরিটি
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm initialData={profileData} />
        </TabsContent>
        <TabsContent value="password" className="space-y-4">
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
