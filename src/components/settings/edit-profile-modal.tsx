/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/services/profile";
import { ModalWrapper } from "../ui/custom/modal-wrapper";
import { ScrollArea } from "../ui/scroll-area";

const profileSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  phone: zod.string().optional(),
  companyName: zod.string().optional(),
  licenseNo: zod.string().optional(),
  address: zod.string().optional(),
  experience: zod.string().optional(),
  location: zod.string().optional(),
  bio: zod.string().optional(),
});

interface EditProfileModalProps {
  profileData: any;
}

export function EditProfileModal({ profileData }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    profileData?.profileImage || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<zod.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profileData?.name || "",
      phone: profileData?.phone || "",
      companyName: profileData?.companyName || "",
      licenseNo: profileData?.licenseNo || "",
      address: profileData?.address || "",
      experience: profileData?.experience?.toString() || "0",
      location: profileData?.location || "",
      bio: profileData?.bio || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: zod.infer<typeof profileSchema>) {
    setLoading(true);
    try {
      const formData = new FormData();
      // Send the data as a JSON string in a "data" field to match backend's report/update logic
      formData.append("data", JSON.stringify(values));
      
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const res = await updateProfile(formData);
      if (res?.success) {
        toast.success("Profile updated successfully");
        // Dispatch custom event to update header and other components
        window.dispatchEvent(new Event("profile-updated"));
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Problem updating");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Edit Profile"
      description="Change your profile information."
      actionTrigger={
        <Button>
          <User />
          Edit Profile
        </Button>
      }
    >
      <ScrollArea className="max-h-[65vh]">
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="h-24 w-24 border-2 border-primary/10">
                  <AvatarImage src={imagePreview || ""} />
                  <AvatarFallback className="text-2xl font-bold">
                    {profileData?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center gap-2">
                  <FormLabel 
                    htmlFor="profile-image-upload"
                    className="cursor-pointer bg-secondary px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    Change Photo
                  </FormLabel>
                  <Input
                    id="profile-image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or WebP format (max 2MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company name (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="License number (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Dhaka, Bangladesh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your detailed address"
                          {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write something about yourself"
                          {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  loadingText="Updating..."
                  className="w-full md:w-auto font-bold uppercase tracking-tighter"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </ModalWrapper>
  );
}
