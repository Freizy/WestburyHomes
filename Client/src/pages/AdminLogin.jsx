// src/pages/AdminLogin.jsx
import React, { useState } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import westLogo from "../Images/west-logo.png"; // ✅ Make sure filename matches exactly

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  const navigate = useNavigate();

  // Handle input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/staff/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token & user
        localStorage.setItem("adminToken", data.data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.data.user));

        setMessageType("success");
        setMessage("Login successful! Redirecting...");

        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setMessageType("error");
        setMessage(data.message || "Login failed. Please check credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessageType("error");
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={westLogo}
            alt="Westbury Homes Logo"
            className="h-40 w-auto mx-auto mb-6"
          />
          <p className="text-[#838FBF] font-sans text-lg">Admin Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-sans font-medium text-[#161616] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#710014] font-sans"
              placeholder="admin@westburyhomes.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-sans font-medium text-[#161616] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#710014] font-sans"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#838FBF] hover:text-[#161616]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg flex items-center space-x-2 ${
                messageType === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-sans text-sm">{message}</span>
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#710014] hover:bg-[#161616] disabled:bg-gray-300 text-white py-4 rounded-lg font-sans font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Lock size={20} />
            <span>{loading ? "Signing In..." : "Sign In"}</span>
          </button>
        </form>

        {/* Credentials Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-sans font-medium text-[#161616] mb-2">
            Default Admin Credentials:
          </h3>
          <div className="text-xs font-sans text-[#838FBF] space-y-1">
            <p>
              <strong>Email:</strong> admin@westburyhomes.com
            </p>
            <p>
              <strong>Password:</strong> admin123
            </p>
          </div>
          <p className="text-xs text-[#838FBF] mt-2 italic">
            Please change these credentials after first login for security.
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-[#710014] hover:text-[#161616] font-sans text-sm transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
