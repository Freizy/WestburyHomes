import React, { useState, useEffect } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  Package,
  AlertTriangle,
  Plus,
  Edit,
  //Trash2,
  TrendingUp,
  Calendar,
  BarChart3,
  LogOut,
  UserPlus,
  Shield,
  BookOpen,
  Check,
  X,
} from "lucide-react";
import westLogo from "../Images/west logo.png";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({});
  const [staffMembers, setStaffMembers] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Form states
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [updatingBooking, setUpdatingBooking] = useState(null);

  // Form data
  const [staffForm, setStaffForm] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
  });

  const [inventoryForm, setInventoryForm] = useState({
    name: "",
    category: "",
    quantity: "",
    minQuantity: "",
    unit: "",
  });

  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");

    const raw = localStorage.getItem("adminUser");
    const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;

    if (!token || !user) {
      navigate("/admin-login");
      return;
    }

    // Set local state for UI first
    setAdminUser(user);

    // Fetch using the parsed local `user` so we correctly include superadmin
    // endpoints on the very first fetch (state updates are async).
    fetchDashboardData(user?.role);

    // Set up real-time updates every 30 seconds. The effect depends on
    // adminUser?.role below, so when role changes the interval will be
    // recreated and use the updated role value.
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
    // Re-run when navigation or the admin user's role changes
  }, [navigate, adminUser?.role]);

  // Safe JSON parser for fetch responses
  const parseJsonSafely = async (res, label = "") => {
    try {
      if (!res) return {};
      if (!res.ok) {
        console.warn(`API ${label} returned status ${res.status}`);
        // attempt to JSON-parse error body if available
        try {
          const err = await res.json();
          return err;
        } catch (e) {
          return {};
        }
      }
      return await res.json();
    } catch (error) {
      console.warn(`Failed to parse JSON for ${label}:`, error);
      return {};
    }
  };

  // Fetch dashboard data. Accept optional `role` to decide superadmin fetches
  // immediately when adminUser state hasn't been updated yet.
  const fetchDashboardData = async (role = adminUser?.role) => {
    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const promises = [
        fetch("/api/staff/dashboard", { headers }),
        fetch("/api/staff/attendance", { headers }),
        fetch("/api/staff/inventory", { headers }),
        fetch("/api/bookings", { headers }),
        fetch("/api/properties", { headers }),
      ];

      // Only fetch staff and admin data if superadmin
      if (role === "superadmin") {
        promises.push(fetch("/api/staff/staff/admin", { headers }));
        promises.push(fetch("/api/staff/auth/admins", { headers }));
      }

      const responses = await Promise.all(promises);

      // Parse responses safely and provide defaults if not present
      const stats = await parseJsonSafely(responses[0], "dashboard");
      const attendance = await parseJsonSafely(responses[1], "attendance");
      const inventoryData = await parseJsonSafely(responses[2], "inventory");
      const bookingsData = await parseJsonSafely(responses[3], "bookings");
      const suitesData = await parseJsonSafely(responses[4], "properties");

      setDashboardStats(stats?.data ?? {});
      setAttendanceLogs(attendance?.data ?? []);
      setInventory(inventoryData?.data ?? []);
      setBookings(bookingsData?.data ?? []);
      setSuites(suitesData?.data ?? []);

      // Set superadmin-specific data (indices 5 & 6 when role === superadmin)
      if (role === "superadmin") {
        const staffData = await parseJsonSafely(responses[5], "staff-admin");
        const adminsData = await parseJsonSafely(responses[6], "admins");
        setStaffMembers(staffData?.data ?? []);
        setAdminUsers(adminsData?.data ?? []);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
      // Defensive: reset to safe defaults so UI doesn't crash
      setDashboardStats({});
      setAttendanceLogs([]);
      setInventory([]);
      setBookings([]);
      setSuites([]);
      if (adminUser?.role === "superadmin") {
        setStaffMembers([]);
        setAdminUsers([]);
      }
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/staff/staff/admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffForm),
      });

      if (response.ok) {
        setShowAddStaff(false);
        setStaffForm({ name: "", position: "", email: "", phone: "" });
        setMessage("Staff member added successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchDashboardData();
      } else {
        const err = await parseJsonSafely(response, "add-staff");
        setMessage(err?.message || "Failed to add staff");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      setMessage("Error adding staff");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/staff/inventory", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryForm),
      });

      if (response.ok) {
        setShowAddInventory(false);
        setInventoryForm({
          name: "",
          category: "",
          quantity: "",
          minQuantity: "",
          unit: "",
        });
        setMessage("Inventory item added successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchDashboardData();
      } else {
        const err = await parseJsonSafely(response, "add-inventory");
        setMessage(err?.message || "Failed to add inventory");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error adding inventory:", error);
      setMessage("Error adding inventory");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateInventory = async (id, quantity) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/staff/inventory/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        setEditingItem(null);
        setMessage("Inventory updated successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchDashboardData();
      } else {
        const err = await parseJsonSafely(response, "update-inventory");
        setMessage(err?.message || "Failed to update inventory");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      setMessage("Error updating inventory");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/staff/auth/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminForm),
      });

      const data = await parseJsonSafely(response, "add-admin");

      if (response.ok) {
        setShowAddAdmin(false);
        setAdminForm({ username: "", email: "", password: "" });
        setMessage("Admin user created successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchDashboardData();
      } else {
        setMessage(data.message || "Failed to create admin user");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      setMessage("Error creating admin user");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      console.log("Updating booking status:", { bookingId, status });
      setUpdatingBooking(bookingId);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setMessage("Authentication token not found. Please login again.");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await parseJsonSafely(response, "update-booking");
        console.log("Update successful:", result);
        setMessage(`Booking ${status} successfully!`);
        setTimeout(() => setMessage(""), 3000);
        fetchDashboardData();
      } else {
        const errorData = await parseJsonSafely(response, "update-booking-error");
        console.error("Update failed:", errorData);
        setMessage(
          `Failed to update booking: ${errorData.error || errorData.message || "Unknown error"}`
        );
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      setMessage(`Error updating booking: ${error.message}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUpdatingBooking(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#710014] mx-auto"></div>
          <p className="mt-4 text-[#161616] font-sans">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F1ED]">
      {/* Header */}
      <div className="bg-[#161616] text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={westLogo}
              alt="WESTBURY HOMES Logo"
              className="h-40 w-auto"
            />
            <div>
              <h1 className="text-2xl font-garamond font-bold mb-2">Admin Portal</h1>
              <p className="text-[#838FBF] font-sans">Staff & Inventory Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-[#838FBF]">Logged in as</p>
              <p className="font-sans font-medium">{adminUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#710014] hover:bg-red-700 text-white px-4 py-2 rounded-lg font-sans font-medium transition-colors flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              ...(adminUser?.role === "superadmin"
                ? [
                    { id: "staff", label: "Staff Management", icon: Users },
                    { id: "admins", label: "Admin Management", icon: Shield },
                  ]
                : []),
              { id: "bookings", label: "Booking Management", icon: BookOpen },
              { id: "availability", label: "Suite Availability", icon: Calendar },
              { id: "attendance", label: "Attendance", icon: Clock },
              { id: "inventory", label: "Inventory", icon: Package },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-sans transition-colors ${
                    activeTab === tab.id
                      ? "border-[#710014] text-[#710014]"
                      : "border-transparent text-[#838FBF] hover:text-[#161616]"
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="container mx-auto px-6 py-4">
          <div
            className={`px-4 py-3 rounded ${
              message.includes("successfully") || message.includes("Successfully")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="container mx-auto px-6 py-2">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
            <strong>Debug Info:</strong> Token: {localStorage.getItem("adminToken") ? "Present" : "Missing"} | User: {adminUser?.email || "None"} | Role: {adminUser?.role || "None"} | Bookings: {bookings.length} | Active Tab: {activeTab}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#838FBF] font-sans text-sm">Active Staff</p>
                    <p className="text-3xl font-garamond font-bold text-[#161616]">{dashboardStats?.activeStaff || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#710014]/10 rounded-lg flex items-center justify-center">
                    <Users className="text-[#710014]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#838FBF] font-sans text-sm">Total Staff</p>
                    <p className="text-3xl font-garamond font-bold text-[#161616]">{dashboardStats?.totalStaff || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#838FBF]/10 rounded-lg flex items-center justify-center">
                    <Users className="text-[#838FBF]" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#838FBF] font-sans text-sm">Low Stock Items</p>
                    <p className="text-3xl font-garamond font-bold text-[#161616]">{dashboardStats?.lowStockItems || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#838FBF] font-sans text-sm">Attendance Rate</p>
                    <p className="text-3xl font-garamond font-bold text-[#161616]">{dashboardStats?.attendanceRate || 0}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-garamond font-bold text-[#161616] mb-4">Recent Attendance</h3>
                <div className="space-y-3">
                  {attendanceLogs && attendanceLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-sans font-medium text-[#161616]">{log.staffName}</p>
                        <p className="text-sm text-[#838FBF]">{log.date} • {log.timeIn}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-sans ${log.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-garamond font-bold text-[#161616] mb-4">Low Stock Alerts</h3>
                <div className="space-y-3">
                  {Array.isArray(inventory)
                    ? inventory
                        .filter((item) => item.status === "low-stock")
                        .slice(0, 5)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                            <div>
                              <p className="font-sans font-medium text-[#161616]">{item.name}</p>
                              <p className="text-sm text-[#838FBF]">{item.quantity} {item.unit} remaining</p>
                            </div>
                            <span className="px-2 py-1 rounded-full text-xs font-sans bg-red-100 text-red-800">Low Stock</span>
                          </div>
                        ))
                    : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "staff" && adminUser?.role === "superadmin" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-garamond font-bold text-[#161616]">Staff Management</h2>
              <button onClick={() => setShowAddStaff(true)} className="bg-[#710014] hover:bg-[#161616] text-white px-4 py-2 rounded-lg font-sans font-medium transition-colors flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Staff</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffMembers.map((staff) => (
                      <tr key={staff.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans font-medium text-[#161616]">{staff.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans text-[#838FBF]">{staff.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans text-[#838FBF]">{staff.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans text-[#838FBF]">{staff.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-sans ${staff.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{staff.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "attendance" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-garamond font-bold text-[#161616]">Attendance Logs</h2>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Staff</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Time In</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Time Out</th>
                      <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans font-medium text-[#161616]">{log.staffName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans text-[#838FBF]">{log.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans text-[#838FBF]">{log.timeIn}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-sans text-[#838FBF]">{log.timeOut || "-"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-sans ${log.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "availability" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-garamond font-bold text-[#161616]">Suite Availability Overview</h2>
            </div>

            {/* Suite Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suites.map((suite) => {
                const suiteBookings = bookings.filter((b) => b.property_id === suite.id);
                const isOccupied = suiteBookings.some(
                  (b) =>
                    b.status === "confirmed" &&
                    new Date(b.check_in_date) <= new Date() &&
                    new Date(b.check_out_date) >= new Date()
                );

                return (
                  <div key={suite.id} className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-garamond font-semibold text-[#161616]">{suite.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-sans ${isOccupied ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {isOccupied ? "Occupied" : "Available"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#838FBF]">Price:</span>
                        <span className="font-medium">${suite.price?.toLocaleString()}/night</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#838FBF]">Total Bookings:</span>
                        <span className="font-medium">{suiteBookings.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#838FBF]">Confirmed:</span>
                        <span className="font-medium">{suiteBookings.filter((b) => b.status === "confirmed").length}</span>
                      </div>
                    </div>

                    {/* Upcoming Bookings */}
                    {suiteBookings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-sans font-medium text-[#161616] mb-2">Upcoming Bookings:</h4>
                        <div className="space-y-1">
                          {suiteBookings
                            .filter((b) => new Date(b.check_in_date) >= new Date())
                            .slice(0, 3)
                            .map((booking) => (
                              <div key={booking.id} className="text-xs bg-gray-50 p-2 rounded">
                                <div className="flex justify-between">
                                  <span className="text-[#838FBF]">{booking.guest_name}</span>
                                  <span className={`px-1 rounded text-xs ${booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {booking.status}
                                  </span>
                                </div>
                                <div className="text-[#838FBF]">
                                  {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-garamond font-bold text-[#161616] mb-4">Monthly Booking Calendar</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-sans font-medium text-[#838FBF] uppercase">Suite</th>
                      <th className="px-4 py-2 text-left text-xs font-sans font-medium text-[#838FBF] uppercase">Current Status</th>
                      <th className="px-4 py-2 text-left text-xs font-sans font-medium text-[#838FBF] uppercase">Next Available</th>
                      <th className="px-4 py-2 text-left text-xs font-sans font-medium text-[#838FBF] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {suites.map((suite) => {
                      const suiteBookings = bookings.filter((b) => b.property_id === suite.id);
                      const currentBooking = suiteBookings.find(
                        (b) =>
                          b.status === "confirmed" &&
                          new Date(b.check_in_date) <= new Date() &&
                          new Date(b.check_out_date) >= new Date()
                      );
                      const nextAvailable = suiteBookings
                        .filter((b) => b.status === "confirmed" && new Date(b.check_out_date) > new Date())
                        .sort((a, b) => new Date(a.check_out_date) - new Date(b.check_out_date))[0];

                      return (
                        <tr key={suite.id}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-sans font-medium text-[#161616]">{suite.title}</div>
                            <div className="text-xs text-[#838FBF]">${suite.price?.toLocaleString()}/night</div>
                          </td>
                          <td className="px-4 py-3">
                            {currentBooking ? (
                              <div>
                                <span className="px-2 py-1 rounded-full text-xs font-sans bg-red-100 text-red-800">Occupied</span>
                                <div className="text-xs text-[#838FBF] mt-1">Until {new Date(currentBooking.check_out_date).toLocaleDateString()}</div>
                              </div>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-sans bg-green-100 text-green-800">Available</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {nextAvailable ? (
                              <div className="text-sm text-[#838FBF]">{new Date(nextAvailable.check_out_date).toLocaleDateString()}</div>
                            ) : (
                              <div className="text-sm text-green-600">Available now</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                // Show detailed booking history for this suite
                                const suiteBookings = bookings.filter((b) => b.property_id === suite.id);
                                alert(`${suite.title} - Total Bookings: ${suiteBookings.length}\nConfirmed: ${suiteBookings.filter((b) => b.status === "confirmed").length}\nPending: ${suiteBookings.filter((b) => b.status === "pending").length}`);
                              }}
                              className="text-[#710014] hover:text-[#161616] text-sm font-sans font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}


      </div>
    </div>
  );
};

{activeTab === "inventory" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-garamond font-bold text-[#161616]">
        Inventory Management
      </h2>
      <button
        onClick={() => setShowAddInventory(true)}
        className="bg-[#710014] hover:bg-[#161616] text-white px-4 py-2 rounded-lg font-sans font-medium transition-colors flex items-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Item</span>
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Min Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans font-medium text-[#161616]">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      defaultValue={item.quantity}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      onBlur={(e) => handleUpdateInventory(item.id, e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleUpdateInventory(item.id, e.target.value)
                      }
                      autoFocus
                    />
                  ) : (
                    <div className="text-sm font-sans text-[#838FBF]">
                      {item.quantity} {item.unit}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">
                    {item.minQuantity} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-sans ${
                      item.status === "in-stock"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditingItem(item.id)}
                    className="text-[#710014] hover:text-[#161616] mr-3"
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
)}

{activeTab === "bookings" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-garamond font-bold text-[#161616]">Booking Management</h2>
    </div>

    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Suite</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Check-in</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Check-out</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-sans font-medium text-[#161616]">{booking.guest_name}</div>
                    <div className="text-sm font-sans text-[#838FBF]">{booking.guest_email}</div>
                    <div className="text-sm font-sans text-[#838FBF]">{booking.guest_phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">
                    {suites.find((s) => s.id === booking.property_id)?.title || `Suite #${booking.property_id}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">
                    {new Date(booking.check_in_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">
                    {new Date(booking.check_out_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">{booking.guests_count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans font-medium text-[#161616]">
                    ${booking.total_amount?.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-sans ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
                          disabled={updatingBooking === booking.id}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            updatingBooking === booking.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "text-green-600 hover:text-green-800 hover:bg-green-50"
                          }`}
                          title="Confirm"
                        >
                          {updatingBooking === booking.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Check size={16} />
                              <span className="text-xs">Confirm</span>
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")}
                          disabled={updatingBooking === booking.id}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            updatingBooking === booking.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800 hover:bg-red-50"
                          }`}
                          title="Cancel"
                        >
                          {updatingBooking === booking.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <X size={16} />
                              <span className="text-xs">Cancel</span>
                            </div>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
)}

{activeTab === "admins" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-garamond font-bold text-[#161616]">Admin Management</h2>
      <button
        onClick={() => setShowAddAdmin(true)}
        className="bg-[#710014] hover:bg-[#161616] text-white px-4 py-2 rounded-lg font-sans font-medium transition-colors flex items-center space-x-2"
      >
        <UserPlus size={20} />
        <span>Add Admin</span>
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-sans font-medium text-[#838FBF] uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adminUsers.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans font-medium text-[#161616]">{admin.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">{admin.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-sans ${
                      admin.role === "superadmin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-sans text-[#838FBF]">
                    {new Date(admin.created_at).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
)}

export default AdminDashboard; // Exporting here to make it easier to test this part standalone. Remove if part 2 contains another export.
