import { useEffect, useState } from "react";

/**
 * Hook to determine if this is the user's first visit
 * @param key Unique key for storing the visit status in localStorage
 * @returns Object with isFirstVisit flag and markVisited function
 */
export function useFirstVisit(key = "user_visited") {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  
  useEffect(() => {
    const hasVisited = localStorage.getItem(key);
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, [key]);
  
  const markVisited = () => {
    localStorage.setItem(key, "true");
    setIsFirstVisit(false);
  };
  
  return { isFirstVisit, markVisited };
}