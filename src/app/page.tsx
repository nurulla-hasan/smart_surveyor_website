
import { redirect } from "next/navigation";

export default async function Home() {
  const user = {
    role: 'surveyor'
  };
  
  if (!user) {
    redirect("/login");
  }

  if (user.role === 'client') {
    redirect("/portal");
  }

  redirect("/dashboard");
}
