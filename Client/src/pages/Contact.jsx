import React, { useState } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { submitContactForm } from "../services/api";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Phone",
      details: "+233 0558469564",
      link: "tel:+2330558469564",
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      details: "enquiries@westburyhomesgh.com",
      link: "mailto:enquiries@westburyhomesgh.com",
    },
    {
      icon: <MapPin size={24} />,
      title: "Address",
      details: "Westbury Homes, Trasacco East Legon",
      link: "#",
    },
    {
      icon: <Clock size={24} />,
      title: "Business Hours",
      details: "Open 24/7",
      link: "#",
    },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        message: data.message,
        subject: data.subject,
        phone: data.phone,
      };
      await submitContactForm(payload);
      toast.success("Message sent successfully!");
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-12 shadow-luxury text-center max-w-md mx-4"
        >
          <div className="bg-[#710014] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#161616] mb-4">
            Message Sent!
          </h2>
          <p className="text-[#838FBF] font-sans mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-[#710014] hover:bg-[#161616] text-white px-6 py-3 rounded-lg font-sans font-semibold transition-all duration-300"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F1ED]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#710014] to-[#161616] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl font-sans text-[#F2F1ED] mb-8">
              Get in touch with us today
            </p>
            <p className="text-lg font-sans text-[#838FBF] max-w-3xl mx-auto">
              Ready to experience luxury living? Contact us to learn more about
              our properties or schedule a viewing. We're here to help you find
              your perfect home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-[#F2F1ED] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#710014] transition-all duration-300">
                  <div className="text-[#710014] group-hover:text-white transition-colors">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#161616] mb-2">
                  {info.title}
                </h3>
                <a
                  href={info.link}
                  className="text-[#838FBF] font-sans hover:text-[#710014] transition-colors duration-300"
                >
                  {info.details}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-[#F2F1ED]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl p-8 shadow-luxury"
              >
                <h2 className="text-3xl font-serif font-bold text-[#161616] mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#161616] font-sans font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans"
                        placeholder="Your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1 font-sans">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[#161616] font-sans font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans"
                        placeholder="Your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1 font-sans">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[#161616] font-sans font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1 font-sans">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[#161616] font-sans font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans"
                      placeholder="Your phone number"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[#161616] font-sans font-medium mb-2">
                      Subject
                    </label>
                    <select
                      {...register("subject", {
                        required: "Subject is required",
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="property">Property Information</option>
                      <option value="booking">Booking Request</option>
                      <option value="support">Customer Support</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-600 text-sm mt-1 font-sans">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[#161616] font-sans font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      {...register("message", {
                        required: "Message is required",
                      })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-[#838FBF] focus:outline-none focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <p className="text-red-600 text-sm mt-1 font-sans">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#710014] hover:bg-[#161616] disabled:bg-[#838FBF] text-white px-6 py-4 rounded-lg font-sans font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner w-5 h-5"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Map + Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Map */}
                <div className="bg-white rounded-2xl p-6 shadow-luxury">
                  <h3 className="text-2xl font-serif font-bold text-[#161616] mb-4">
                    Our Location
                  </h3>
                  <div className="rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.3837941518095!2d-0.11869361643680673!3d5.657499116619211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf834431c59fbb%3A0x2d857abfad2b3382!2sWestbury%20Homes!5e0!3m2!1sen!2sgh!4v1754597629618!5m2!1sen!2sgh"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Westbury Homes Location"
                      className="w-full"
                    ></iframe>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="bg-white rounded-2xl p-6 shadow-luxury">
                  <h3 className="text-2xl font-serif font-bold text-[#161616] mb-4">
                    Get in Touch
                  </h3>
                  <div className="space-y-4">
                    <p className="text-[#838FBF] font-sans leading-relaxed">
                      We're here to help you find your perfect luxury home in
                      Accra. Whether you have questions about our properties,
                      want to schedule a viewing, or need assistance with
                      anything else, don't hesitate to reach out.
                    </p>
                    <div className="bg-[#F2F1ED] rounded-lg p-4">
                      <h4 className="font-serif font-semibold text-[#161616] mb-2">
                        Business Hours
                      </h4>
                      <p className="text-[#838FBF] font-sans text-sm">
                        We are available 24/7 to respond to your inquiries.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
