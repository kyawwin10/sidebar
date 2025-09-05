import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth"; // your hook
import api from "@/api"; // your API wrapper
import { UserDTO } from "@/api/user/type";
import { User } from "lucide-react";

const DeliveryNavBar = () => {
  const [open, setOpen] = useState(false);
  const { userCredentials } = useAuth();
   const [user, setUser] = useState<UserDTO | null>(null); // 👈 typed state

  // Fetch user details from backend
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
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white shadow-sm">
      <div className="text-lg font-semibold">Delivery</div>

      <div className="relative ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((prev) => !prev)}
        >
          <User size={18} />
        </Button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-md text-sm">
            {user ? (
              <>
                <div className="px-4 py-3 border-b">
                  <p className="font-medium">{userCredentials?.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
                <div className="px-4 py-2 text-gray-700">
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

export default DeliveryNavBar;
