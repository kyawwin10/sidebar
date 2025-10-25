import { useState } from "react";
import api from "@/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Email/Password login
  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Login Successfully", {
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
      toast.error("Login failed", {
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
  // const forgotPasswordMutation = api.auth.forgotPassword.useMutation({
  //   onSuccess: () => toast.success("Check your email for OTP 🔑", {
  //     position: "top-right",
  //     duration: 3000,
  //     style: {
  //       background: "rgba(255, 255, 255, 0.1)",
  //       backdropFilter: "blur(8px)",
  //       border: "1px solid rgba(255, 255, 255, 0.2)",
  //       color: "#fff",
  //       borderRadius: "8px",
  //     },
  //   }),
  //   onError: () => toast.error("Failed to send OTP ❌", {
  //     position: "top-right",
  //     duration: 3000,
  //     style: {
  //       background: "rgba(255, 255, 255, 0.1)",
  //       backdropFilter: "blur(8px)",
  //       border: "1px solid rgba(255, 255, 255, 0.2)",
  //       color: "#fff",
  //       borderRadius: "8px",
  //     },
  //   }),
  // });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  // const handleForgotPassword = () => {
  //   forgotPasswordMutation.mutate({ email });
  // };

  return (
    <div className="flex justify-center items-center min-h-screen w-full lg:w-[40%] px-4 sm:px-6 lg:px-0">
      <div className="border border-[#DCDCDC] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-xl p-4 am:p-6 w-full max-w-[450px]">
        <h2 className="text-md font-bold text-center mb-6 text-black">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 bg-white border border-[#DCDCDC] rounded-lg text-black placeholder-[#646464]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 mb-3 bg-white border border-[#DCDCDC] rounded-lg text-black placeholder-[#646464]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="absolute p-3 mb-3 inset-y-2 right-3 flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </div>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          className="w-full text-white p-6 rounded-lg"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>

        {/* Forgot password */}
        {/* <p
          onClick={handleForgotPassword}
          className="text-sm text-white/80 mt-3 cursor-pointer text-center hover:text-white transition-colors duration-300"
        >
          Forgot password?
        </p> */}
      </div>
    </div>
  );
};

export default LoginView;