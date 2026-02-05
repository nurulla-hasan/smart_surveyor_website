
import { getCurrentUser } from "@/services/auth";
import { redirect } from "next/navigation";
import PublicHomeView from "@/components/public/public-home-view";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  
  // Everyone (Logged out, Clients, etc.) will be redirected to the Public Home Page
  if (!user || user.role === 'client') {
    redirect("/home");
  }

  // Only Surveyors/Admins are redirected to dashboard
  redirect("/dashboard");
}
