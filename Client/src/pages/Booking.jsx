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
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDateChange = (type, date) => {
    setSelectedDates((prev) => ({ ...prev, [type]: date }));
  };

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


  // Apartment/room image mapping
  const suiteImageMap = {
    "KARR - 1 Bedroom Penthouse":
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    "RONY - 1 Bedroom Penthouse":
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    "ALLY - 2 Bedroom Plus Ensuite":
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    "EBB - 2 Bedroom Standard Ensuite":
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    "KIKI - 2 Bedroom Penthouse":
      "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=800&q=80",
    "LIZ - 2 Bedroom Standard Ensuite":
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=800&q=80",
    "MIMI - 2 Bedroom Plus Ensuite":
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    "Studio Suite":
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    "One Bedroom Suite":
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    "Two Bedroom Suite":
      "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=800&q=80",
    "Penthouse Suite":
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=800&q=80",
  };

  return (
    <div className="min-h-screen bg-[#F2F1ED] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/properties")}
            className="flex items-center text-[#710014] hover:text-[#161616] mb-4 transition-colors font-sans font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Properties
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-garamond font-bold text-[#161616] mb-2">
            Book Your Suite
          </h1>
          <p className="text-[#838FBF] font-sans text-base sm:text-lg">
            Select from our available suites and choose your preferred dates
          </p>
        </div>

        {/* Mobile Booking Panel - Show when suite is selected on mobile */}
        {selectedSuite && (
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-luxury">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-garamond font-semibold text-[#161616] text-lg">
                  {selectedSuite.title}
                </h3>
                <button
                  onClick={() => setSelectedSuite(null)}
                  className="text-[#838FBF] hover:text-[#710014]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xl font-garamond font-bold text-[#710014] mb-4">
                ${selectedSuite.price?.toLocaleString()}/night
              </div>
              <button
                onClick={() =>
                  document
                    .getElementById("booking-form")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="w-full bg-[#710014] hover:bg-[#161616] text-white px-4 py-3 rounded-lg font-sans font-semibold transition-all duration-300"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Available Suites */}
          <div className="xl:col-span-2">
            <h2 className="text-xl sm:text-2xl font-garamond font-bold text-[#161616] mb-4 sm:mb-6">
              Available Suites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {suites.map((suite) => (
                <motion.div
                  key={suite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl p-4 sm:p-6 shadow-luxury cursor-pointer transition-all duration-300 ${
                    selectedSuite?.id === suite.id
                      ? "ring-2 ring-[#710014]"
                      : "hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedSuite(suite)}
                >
                  {(() => {
                    let imageUrl =
                      Array.isArray(suite.images) && suite.images.length > 0
                        ? suite.images[0]
                        : null;
                    if (
                      !imageUrl ||
                      imageUrl.startsWith("client/src/Images") ||
                      imageUrl.startsWith("./") ||
                      imageUrl.startsWith("../")
                    ) {
                      imageUrl =
                        suiteImageMap[suite.title] ||
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
                    }
                    return (
                      <img
                        src={imageUrl}
                        alt={suite.title}
                        className="w-full h-40 sm:h-48 object-cover rounded-xl mb-4"
                      />
                    );
                  })()}
                  <h3 className="text-lg sm:text-xl font-garamond font-semibold text-[#161616] mb-2">
                    {suite.title}
                  </h3>
                  <p className="text-[#838FBF] font-sans text-sm sm:text-base mb-3">
                    {suite.location}
                  </p>
                  <div className="text-xl sm:text-2xl font-garamond font-bold text-[#710014] mb-4">
                    ${suite.price?.toLocaleString()}/night
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    <div className="flex items-center text-[#838FBF] font-sans text-xs sm:text-sm">
                      <Bed className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#710014]" />
                      <span>{suite.bedrooms || 0}</span>
                    </div>
                    <div className="flex items-center text-[#838FBF] font-sans text-xs sm:text-sm">
                      <Bath className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#710014]" />
                      <span>{suite.bathrooms || 0}</span>
                    </div>
                    <div className="flex items-center text-[#838FBF] font-sans text-xs sm:text-sm">
                      <Square className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#710014]" />
                      <span>{suite.area_sqm || 0}m²</span>
                    </div>
                  </div>

                  <div className="flex items-center text-green-600 font-sans text-xs sm:text-sm">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>Available</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking Panel */}
          <div className="xl:col-span-1">
            <div
              id="booking-form"
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-luxury xl:sticky xl:top-24"
            >
              <h2 className="text-xl sm:text-2xl font-garamond font-bold text-[#161616] mb-4 sm:mb-6">
                Book Now
              </h2>

              {selectedSuite ? (
                <>
                  {/* Selected Suite Info */}
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#F2F1ED] rounded-xl">
                    <h3 className="font-garamond font-semibold text-[#161616] mb-2 text-sm sm:text-base">
                      {selectedSuite.title}
                    </h3>
                    <div className="text-lg sm:text-xl font-garamond font-bold text-[#710014]">
                      ${selectedSuite.price?.toLocaleString()}/night
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-garamond font-semibold text-[#161616] mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#710014]" />
                      Select Dates
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[#161616] font-sans font-medium mb-2 text-sm sm:text-base">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          value={selectedDates.start}
                          onChange={(e) =>
                            handleDateChange("start", e.target.value)
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-[#161616] font-sans font-medium mb-2 text-sm sm:text-base">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={selectedDates.end}
                          onChange={(e) =>
                            handleDateChange("end", e.target.value)
                          }
                          min={
                            selectedDates.start ||
                            new Date().toISOString().split("T")[0]
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-garamond font-semibold text-[#161616] mb-3 sm:mb-4 text-sm sm:text-base flex items-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#710014]" />
                      Guest Information
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={bookingForm.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={bookingForm.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#838FBF]" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={bookingForm.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full pl-10 pr-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#838FBF]" />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={bookingForm.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full pl-10 pr-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base"
                        />
                      </div>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#838FBF]" />
                        <select
                          value={bookingForm.guests}
                          onChange={(e) =>
                            handleInputChange(
                              "guests",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full pl-10 pr-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base appearance-none bg-white"
                        >
                          <option value={1}>1 Guest</option>
                          <option value={2}>2 Guests</option>
                          <option value={3}>3 Guests</option>
                          <option value={4}>4 Guests</option>
                          <option value={5}>5+ Guests</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-[#161616] font-sans font-medium mb-2 text-sm sm:text-base">
                      Special Requirements
                    </label>
                    <textarea
                      value={bookingForm.requirements}
                      onChange={(e) =>
                        handleInputChange("requirements", e.target.value)
                      }
                      rows={3}
                      placeholder="Any special requests..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-sm sm:text-base resize-none"
                    />
                  </div>

                  {/* Booking Summary */}
                  {selectedDates.start && selectedDates.end && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#F2F1ED] rounded-xl">
                      <h3 className="font-garamond font-semibold text-[#161616] mb-3 text-sm sm:text-base">
                        Booking Summary
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm font-sans">
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>{calculateNights()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate per night:</span>
                          <span>${selectedSuite.price?.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-[#838FBF] pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>${calculateTotal().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Book Now Button */}
                  <button
                    onClick={handleBookNow}
                    disabled={
                      submitting || !selectedDates.start || !selectedDates.end
                    }
                    className="w-full bg-[#710014] hover:bg-[#161616] disabled:bg-[#838FBF] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-sans font-semibold text-base sm:text-lg transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-[#838FBF] mx-auto mb-4" />
                  <p className="text-[#838FBF] font-sans text-sm sm:text-base">
                    Select a suite to start booking
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
