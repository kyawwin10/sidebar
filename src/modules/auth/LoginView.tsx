import { useState } from "react";
import api from "@/api"; // import your API service
import { useNavigate } from "react-router-dom";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email/Password login
  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      alert("Login success ✅");
      navigate("/", { replace: true });
    },
    onError:() => {
      alert("Login failed ❌");
    },
  });

  // Forgot password
  const forgotPasswordMutation = api.auth.forgotPassword.useMutation({
    onSuccess: () => alert("Check your email for OTP 🔑"),
    onError: () => alert("Failed to send OTP ❌"),
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  const handleForgotPassword = () => {
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
      <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        {/* Forgot password */}
        <p
          onClick={handleForgotPassword}
          className="text-sm text-blue-500 mt-3 cursor-pointer text-center"
        >
          Forgot password?
        </p>
      </div>
    </div>
  );
};

export default LoginView;
