import { CommandDialog } from "@/components/CommandDialog";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import useAuth from "@/hooks/useAuth";
import { useThemeStore } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const DefaultLayout = () => {
  const { theme } = useThemeStore();
  const { isAuthenticated, userCredentials } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (
    !isAuthenticated ||
    !userCredentials ||
    userCredentials.role !== "Admin"
  ) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div
        className={cn(
          "flex h-screen overflow-hidden",
          theme === "dark"
            ? "bg-gradient-to-l from-pink-500 to-blue-500"
            : "bg-gradient-to-l from-blue-500 to-pink-300"
        )}
      >
        <Sidebar />
        <div
          className={cn(
            "flex flex-col flex-1 overflow-hidden",
            theme === "dark"
              ? "bg-gradient-to-l from-pink-500 to-blue-500"
              : "bg-gradient-to-l from-blue-500 to-pink-300"
          )}
        >
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandDialog />
    </>
  );
};

export default DefaultLayout;
