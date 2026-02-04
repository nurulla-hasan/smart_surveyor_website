
import { getCurrentUser } from "@/services/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  if (user.role === 'client') {
    redirect("/portal");
  }

  redirect("/dashboard");

  // 
}
