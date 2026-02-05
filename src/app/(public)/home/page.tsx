import { getCurrentUser } from "@/services/auth";
import { getPublicSurveyors } from "@/services/surveyors";
import PublicHomeView from "@/components/public/public-home-view";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const surveyorsResponse = await getPublicSurveyors({ page: "1",});
  const surveyors = surveyorsResponse?.data?.surveyors || [];

  return (
    <PublicHomeView 
      user={user} 
      initialSurveyors={surveyors} 
    />
  );
}
