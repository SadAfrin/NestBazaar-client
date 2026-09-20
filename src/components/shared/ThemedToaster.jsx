"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function ThemedToaster() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}
