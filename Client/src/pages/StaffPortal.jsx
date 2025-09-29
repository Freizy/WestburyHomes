import React, { useState, useEffect } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import westLogo from "../Images/west-logo.png";

const StaffPortal = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [currentLog, setCurrentLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch staff members on mount and every 30 seconds
  useEffect(() => {
    fetchStaffMembers();
    const interval = setInterval(() => fetchStaffMembers(), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const response = await fetch("/api/staff/staff");
      const data = await response.json();
      setStaffMembers(data.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleLogin = async () => {
    if (!selectedStaff) {
      setMessage("Please select a staff member");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/staff/attendance/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: selectedStaff }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentLog(data.data);
        setMessage("Successfully logged in!");
        fetchStaffMembers();
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch {
      setMessage("Error logging in");
    } finally {
      setTimeout(() => setMessage(""), 3000);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!selectedStaff) {
      setMessage("Please select a staff member");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/staff/attendance/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: selectedStaff }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentLog(null);
        setMessage("Successfully logged out!");
        fetchStaffMembers();
      } else {
        setMessage(data.message || "Logout failed");
      }
    } catch {
      setMessage("Error logging out");
    } finally {
      setTimeout(() => setMessage(""), 3000);
      setLoading(false);
    }
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getCurrentTime()), 1000);
    return () => clearInterval(timer);
  }, []);

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
            alt="WESTBURY HOMES Logo"
            className="h-48 w-auto mx-auto mb-6"
          />
          <p className="text-[#838FBF] font-sans text-lg">
            Staff Attendance Portal
          </p>
        </div>

        {/* Current Time */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="text-[#710014]" size={20} />
            <span className="text-sm font-sans text-[#838FBF]">
              Current Time
            </span>
          </div>
          <div className="text-2xl font-garamond font-bold text-[#161616]">
            {currentTime}
          </div>
          <div className="text-sm font-sans text-[#838FBF] mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Staff Selection */}
        <div className="mb-6">
          <label className="block text-sm font-sans font-medium text-[#161616] mb-2">
            Select Staff Member
          </label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#710014] font-sans"
          >
            <option value="">Choose staff member...</option>
            {staffMembers.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} - {staff.position}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.includes("Successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.includes("Successfully") ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-sans text-sm">{message}</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading || !selectedStaff}
            className="w-full bg-[#710014] hover:bg-[#161616] disabled:bg-gray-300 text-white py-4 rounded-lg font-sans font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <LogIn size={20} />
            <span>{loading ? "Processing..." : "Clock In"}</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={loading || !selectedStaff}
            className="w-full bg-[#838FBF] hover:bg-[#161616] disabled:bg-gray-300 text-white py-4 rounded-lg font-sans font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut size={20} />
            <span>{loading ? "Processing..." : "Clock Out"}</span>
          </button>
        </div>

        {/* Current Session Info */}
        {currentLog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="text-blue-600" size={16} />
              <span className="text-sm font-sans font-medium text-blue-800">
                Current Session
              </span>
            </div>
            <div className="text-sm font-sans text-blue-700">
              <p>
                <strong>Staff:</strong> {currentLog.staffName}
              </p>
              <p>
                <strong>Date:</strong> {currentLog.date}
              </p>
              <p>
                <strong>Time In:</strong> {currentLog.timeIn}
              </p>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-sans font-medium text-[#161616] mb-2">
            Instructions:
          </h3>
          <ul className="text-xs font-sans text-[#838FBF] space-y-1">
            <li>• Select your name from the dropdown</li>
            <li>• Click "Clock In" when you start your shift</li>
            <li>• Click "Clock Out" when you end your shift</li>
            <li>• You can only have one active session per day</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffPortal;
