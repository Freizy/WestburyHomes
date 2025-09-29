import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  Calendar,
  Check,
  X,
  Clock,
  User,
  Mail,
  Phone,
  Users,
} from "lucide-react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getProperties, createBooking } from "../services/api";

const Booking = () => {
  const navigate = useNavigate();
  //eslint-disable-next-line
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  //eslint-disable-next-line
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [selectedDates, setSelectedDates] = useState({ start: "", end: "" });
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    guests: 1,
    requirements: "",
  });
  //eslint-disable-next-line
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSuites();
  }, []);

  const fetchSuites = async () => {
    try {
      const response = await getProperties();
      setSuites(response || []); // already returns .data from interceptor
    } catch (error) {
      toast.error("Failed to load suites");
      console.error("Error fetching suites:", error);
    } finally {
      setLoading(false);
    }
  };
//eslint-disable-next-line
  const handleDateChange = (type, date) => {
    setSelectedDates((prev) => ({ ...prev, [type]: date }));
  };
//eslint-disable-next-line
  const handleInputChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculateNights = () => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    const start = new Date(selectedDates.start);
    const end = new Date(selectedDates.end);
    const diffTime = end - start;
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
  };

  const calculateTotal = () => {
    if (!selectedSuite) return 0;
    return calculateNights() * (selectedSuite.price || 0);
  };
//eslint-disable-next-line
  const handleBookNow = async () => {
    if (!selectedSuite) return toast.error("Please select a suite");
    if (!selectedDates.start || !selectedDates.end)
      return toast.error("Please select check-in and check-out dates");

    const { firstName, lastName, email, phone } = bookingForm;
    if (!firstName || !lastName || !email || !phone)
      return toast.error("Please fill in all required fields");

    setSubmitting(true);
    try {
      const bookingData = {
        property_id: selectedSuite.id,
        guest_name: `${firstName} ${lastName}`,
        guest_email: email,
        guest_phone: phone,
        check_in_date: selectedDates.start,
        check_out_date: selectedDates.end,
        guests_count: bookingForm.guests,
        total_amount: calculateTotal(),
        special_requests: bookingForm.requirements,
      };

      await createBooking(bookingData);
      toast.success("Booking submitted successfully!");
      navigate("/properties");
    } catch (error) {
      console.error("Booking error:", error);
      const status = error.response?.status;

      if (status === 400) {
        toast.error(error.response?.data?.error || "Invalid booking data");
      } else if (status === 409) {
        toast.error("Property is not available for the selected dates");
      } else if (status === 404) {
        toast.error("Property not found");
      } else {
        toast.error("Failed to submit booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#710014]"></div>
      </div>
    );
  }

  // ... keep your suiteImageMap and JSX as-is below (unchanged) ...
};

export default Booking;
