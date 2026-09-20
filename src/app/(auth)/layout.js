import ThemeToggle from "@/components/shared/ThemeToggle";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle className="bg-card/80 border border-border shadow-sm" />
      </div>
      {children}
    </div>
  );
}