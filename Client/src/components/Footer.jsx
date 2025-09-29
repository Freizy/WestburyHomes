import React from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail
} from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";  // ✅ Twitter comes from Font Awesome
import westLogo from "../Images/west-logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#161616] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={westLogo}
                alt="WESTBURY HOMES Logo"
                className="h-40 w-auto"
              />
            </div>
            <p className="text-[#838FBF] font-sans mb-6">
              Experience luxury living at its finest in the heart of Accra.
              Choose from our exclusive collection of suites and flats.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-[#710014] hover:bg-[#838FBF] rounded-full flex items-center justify-center transition-all duration-300">
                <SiFacebook size={20} />
              </button>
              <button className="w-10 h-10 bg-[#710014] hover:bg-[#838FBF] rounded-full flex items-center justify-center transition-all duration-300">
                <FaTwitter size={20} />
              </button>
              <button className="w-10 h-10 bg-[#710014] hover:bg-[#838FBF] rounded-full flex items-center justify-center transition-all duration-300">
                <SiInstagram size={20} />
              </button>
              <button className="w-10 h-10 bg-[#710014] hover:bg-[#838FBF] rounded-full flex items-center justify-center transition-all duration-300">
                <SiLinkedin size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-garamond font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/suites"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  Our Suites
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Suites */}
          <div>
            <h4 className="text-lg font-garamond font-semibold mb-6">
              Our Suites
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/suites"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  Studio Suite
                </Link>
              </li>
              <li>
                <Link
                  to="/suites"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  One Bedroom Suite
                </Link>
              </li>
              <li>
                <Link
                  to="/suites"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  Two Bedroom Suite
                </Link>
              </li>
              <li>
                <Link
                  to="/suites"
                  className="text-white/80 hover:text-white transition-colors font-sans"
                >
                  Penthouse Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-garamond font-semibold mb-6">
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-[#710014] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/80 font-sans">
                    WESTBURY HOMES
                    <br />
                    Trasacco East Legon
                    <br />
                    Ghana
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-[#710014] flex-shrink-0" />
                <span className="text-white/80 font-sans">+233 0558469564</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-[#710014] flex-shrink-0" />
                <span className="text-white/80 font-sans">
                  enquiries@westburyhomesgh.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#838FBF]/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 font-sans text-sm">
              © 2024 WESTBURY HOMES. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-white/80 hover:text-white transition-colors font-sans text-sm">
                Privacy Policy
              </button>
              <button className="text-white/80 hover:text-white transition-colors font-sans text-sm">
                Terms of Service
              </button>
              <button className="text-white/80 hover:text-white transition-colors font-sans text-sm">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
