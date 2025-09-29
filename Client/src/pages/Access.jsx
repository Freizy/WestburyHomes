import React from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Crown, Users, ArrowRight } from "lucide-react";
import westLogo from "../Images/west-logo.png";

const Access = () => {
  return (
    <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={westLogo}
            alt="WESTBURY HOMES Logo"
            className="h-56 w-auto mx-auto mb-6"
          />
          <p className="text-[#838FBF] font-sans text-lg">
            Management Access Portal
          </p>
        </div>

        {/* Access Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Admin Portal */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-[#710014] to-[#161616] rounded-xl p-6 text-white cursor-pointer"
          >
            <Link to="/admin-login" className="block">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Crown className="text-white" size={24} />
                </div>
                <ArrowRight className="text-white/80" size={20} />
              </div>
              <h3 className="text-xl font-garamond font-bold mb-2">
                Admin Portal
              </h3>
              <p className="text-white/80 font-sans text-sm">
                Access staff management, inventory tracking, attendance
                monitoring, and admin user management.
              </p>
            </Link>
          </motion.div>

          {/* Staff Portal */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-[#838FBF] to-[#161616] rounded-xl p-6 text-white cursor-pointer"
          >
            <Link to="/staff" className="block">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <ArrowRight className="text-white/80" size={20} />
              </div>
              <h3 className="text-xl font-garamond font-bold mb-2">
                Staff Portal
              </h3>
              <p className="text-white/80 font-sans text-sm">
                Clock in and out for attendance tracking. Simple interface for
                daily staff operations.
              </p>
            </Link>
          </motion.div>
        </div>

        {/* Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-garamond font-bold text-[#161616] mb-3">
            Access Information
          </h3>
          <div className="space-y-2 text-sm font-sans text-[#838FBF]">
            <p>
              <strong>Superadmin:</strong> superadmin@westburyhomes.com /
              superadmin123 (Full access)
            </p>
            <p>
              <strong>Admin:</strong> admin@westburyhomes.com / admin123
              (Limited access)
            </p>
            <p>
              <strong>Staff Portal:</strong> Open access for staff attendance
              tracking
            </p>
            <p>
              <strong>Security:</strong> Role-based access control with JWT
              authentication
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-[#710014] hover:text-[#161616] font-sans text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Access;
