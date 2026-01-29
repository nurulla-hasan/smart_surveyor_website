"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export const useSmartFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const updateFilter = useCallback(
    (key: string, value: string | number | null, debounceTime: number = 0) => {
      
      if (timeoutRefs.current[key]) {
        clearTimeout(timeoutRefs.current[key]);
      }

      const executeUpdate = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== "") {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }

        if (key !== "page") {
          params.set("page", "1");
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        delete timeoutRefs.current[key];
      };

      if (debounceTime > 0) {
        timeoutRefs.current[key] = setTimeout(executeUpdate, debounceTime);
      } else {
        executeUpdate();
      }
    },
    [searchParams, pathname, router]
  );

  const updateBatch = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      let hasFilterChanged = false;

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }

        if (key !== "page") {
          hasFilterChanged = true;
        }
      });
      if (hasFilterChanged) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const toggleFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentVal = params.get(key);
      let newValues = currentVal ? currentVal.split(",") : [];

      if (newValues.includes(value)) {
        newValues = newValues.filter((v) => v !== value);
      } else {
        newValues.push(value);
      }
      
      const finalValue = newValues.length > 0 ? newValues.join(",") : null;
      updateFilter(key, finalValue, 0); 
    },
    [searchParams, updateFilter]
  );

  const clearAll = useCallback((excludeKeys: string[] = []) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Array.from(params.keys()).forEach((key) => {
      if (!excludeKeys.includes(key)) {
        params.delete(key);
      }
    });

    // params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const getFilter = useCallback((key: string) => {
    return searchParams.get(key) || "";
  }, [searchParams]);
  
  const getArrayFilter = useCallback((key: string) => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  }, [searchParams]);
  
  const isSelected = useCallback((key: string, value: string) => {
    const val = searchParams.get(key);
    return val ? val.split(",").includes(value) : false;
  }, [searchParams]);

const isFilterActive = useCallback((keys?: string[]) => {
  if (keys && keys.length > 0) {
    return keys.some((key) => searchParams.has(key));
  }

  const allKeys = Array.from(searchParams.keys());
  return allKeys.some((key) => key !== "page");
}, [searchParams]);

const getActiveCount = useCallback((keys?: string[]) => {
  if (keys && keys.length > 0) {
    return keys.filter((key) => searchParams.has(key)).length;
  }

  const allKeys = Array.from(searchParams.keys());
  return allKeys.filter((key) => key !== "page").length;
}, [searchParams]);

  return { 
    updateFilter, 
    updateBatch, 
    toggleFilter, 
    clearAll,
    getFilter, 
    getArrayFilter, 
    isSelected,
    isFilterActive,
    getActiveCount
  };
};