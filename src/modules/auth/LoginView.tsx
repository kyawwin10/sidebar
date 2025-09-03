import { useState } from "react";
import api from "@/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email/Password login
  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Login success ✅", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          borderRadius: "8px",
        },
      });
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Login failed ❌", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          borderRadius: "8px",
        },
      });
    },
  });

  // Forgot password
  const forgotPasswordMutation = api.auth.forgotPassword.useMutation({
    onSuccess: () => toast.success("Check your email for OTP 🔑", {
      position: "top-right",
      duration: 3000,
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#fff",
        borderRadius: "8px",
      },
    }),
    onError: () => toast.error("Failed to send OTP ❌", {
      position: "top-right",
      duration: 3000,
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#fff",
        borderRadius: "8px",
      },
    }),
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  const handleForgotPassword = () => {
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-l from-pink-500 to-blue-500">
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-8 w-96 border border-white/20">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 transition-colors duration-300 disabled:bg-white/10"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        {/* Forgot password */}
        <p
          onClick={handleForgotPassword}
          className="text-sm text-white/80 mt-3 cursor-pointer text-center hover:text-white transition-colors duration-300"
        >
          Forgot password?
        </p>
      </div>
    </div>
  );
};

export default LoginView;