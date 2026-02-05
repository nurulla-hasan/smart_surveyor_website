/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";
import { buildQueryString } from "@/lib/buildQueryString";
import { QueryParams } from "@/types/global.type";

export const getPublicSurveyors = async (query: QueryParams = {}): Promise<any> => {
  try {
    const response = await serverFetch(`/users/surveyors${buildQueryString(query)}`, {
      isPublic: true,
      next: {
        revalidate: 86400, // 1 day
        tags: ["surveyors"],
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching public surveyors:", error);
    return null;
  }
};

export const getPublicSurveyorProfile = async (id: string): Promise<any> => {
  try {
    const response = await serverFetch(`/users/surveyors/${id}`, {
      isPublic: true,
      next: {
        revalidate: 86400, // 1 day
        tags: [`surveyor-${id}`],
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching public surveyor profile:", error);
    return null;
  }
};
