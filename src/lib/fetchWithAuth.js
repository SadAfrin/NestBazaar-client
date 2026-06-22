import { authClient } from "@/lib/auth-client";

export const fetchWithAuth = async (url, options = {}) => {
  try {
    const { data: tokenData } = await authClient.token();
    
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenData?.token}`,
        ...options.headers,
      },
    });
  } catch (error) {
    console.error("Auth token error:", error);
    throw error;
  }
};