
import { redirect } from "next/navigation";

export default async function Home() {
  const user = {
    role: 'surveyor'
  };
  
  if (!user) {
    redirect("/auth/login");
  }

  if (user.role === 'client') {
    redirect("/portal");
  }

  redirect("/dashboard");
}
