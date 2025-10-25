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

  // Redirect if not authenticated or no user credentials
  if (!isAuthenticated || !userCredentials) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (userCredentials.role === "Delivery") {
    return <Navigate to="/deliverylayout" replace />;
  } else if (userCredentials.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div
        className={cn(
          "flex h-screen overflow-hidden",
          theme === "dark"
            ? "bg-gradient-to-br from-[#4da0b0] to-[#D39D38]"
            : "bg-gradient-to-r from-[#abbaab] to-[#ffffff]"
        )}
      >
        <Sidebar />
        <div
          className={cn(
            "flex flex-col flex-1 overflow-hidden",
            theme === "dark"
              ? "bg-gradient-to-r from-[#eef2f3] to-[#8e9eab]"
              : "bg-gradient-to-r from-[#ffefba] to-[#ffffff]"
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