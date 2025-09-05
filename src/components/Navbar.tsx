"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User as UserIcon } from "lucide-react";
import { useThemeStore } from "@/lib/theme";
import useAuth from "@/hooks/useAuth";
import api from "@/api";
import { UserDTO } from "@/api/user/type";

export const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { userCredentials } = useAuth();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userCredentials?.userID) {
        try {
          const res = await api.user.userApi.getUser(userCredentials.userID);
          setUser(res);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }
    };
    fetchUser();
  }, [userCredentials]);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 ">
      <div className="text-lg font-semibold">Dashboard</div>

      <div className="flex items-center gap-4 ml-auto relative">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </Button>

        {/* User menu */}
        <Button variant="ghost" size="icon" onClick={() => setOpen((p) => !p)}>
          <UserIcon size={18} />
        </Button>

        {open && (
          <div className="absolute right-0 top-12 w-56 bg-white border rounded shadow-md text-sm ">
            {user ? (
              <>
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <p className="font-medium">{user.userName}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
                <div className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Role: <span className="font-medium">{userCredentials?.role}</span>
                </div>
              </>
            ) : (
              <div className="px-4 py-3 text-gray-500">Loading...</div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
