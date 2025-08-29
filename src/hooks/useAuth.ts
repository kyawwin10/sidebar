import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  exp: number;
}
type UserCredentials = {
  name: string;
  userID: string;
  role: string;
}

export default function useAuth() {
  const cookieToken = localStorage.getItem("token") || null;

  let initialToken: string | null = cookieToken;
  let initialCredentials: UserCredentials | null = null;
  let initialAuthenticated = false;

  if (cookieToken) {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(cookieToken);
      initialCredentials = {
        name: decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],
        userID:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      };
      initialAuthenticated = true;
    } catch {
      localStorage.removeItem("token");
      initialToken = null;
    }
  }

  const [token, setToken] = useState<string | null>(initialToken);
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(initialAuthenticated);
  const [userCredentials, setUserCredentials] =
    useState<UserCredentials | null>(initialCredentials);

  useEffect(() => {
    if (!token) {
      setUserCredentials(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);

      setUserCredentials({
        name: decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],
        userID:
          decoded[
             "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      });

      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("token");
      setToken(null);
      setUserCredentials(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const userLogin = (newToken: string) => {
    if (newToken !== token) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
  };

  const userLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setUserCredentials(null);
  };

  return { isAuthenticated, userCredentials, userLogin, userLogout };
}
