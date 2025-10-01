import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
} from "lucide-react";
import { getFeaturedProperties } from "../services/api";

// ✅ Import static images at the top
import ExteriorDay from "../Images/IMAGES/EXTERIOR DAY.JPG";
import ExteriorNight from "../Images/IMAGES/EXTERIOR NIGHT.JPG";

const Home = () => {
  const [featuredSuites, setFeaturedSuites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSuites = async () => {
      try {
        const response = await getFeaturedProperties();
        const suitesData = response?.data || [];
        setFeaturedSuites(Array.isArray(suitesData) ? suitesData : []);
      } catch (error) {
        console.error("Error fetching featured suites:", error);
        setFeaturedSuites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSuites();
  }, []);

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
    <div className="min-h-screen bg-[#F2F1ED]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={ExteriorDay}
            alt="WESTBURY HOMES Outdoor Apartment View"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#710014]/80 to-[#161616]/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-garamond font-bold mb-6 tracking-wide">
              WESTBURY HOMES
            </h1>
            <p className="text-xl md:text-2xl font-sans text-[#838FBF] mb-8 max-w-3xl mx-auto font-light">
              Experience luxury living at its finest in the heart of Accra.
              Choose from our exclusive collection of suites and flats.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/booking"
                className="bg-[#710014] hover:bg-[#161616] text-white px-8 py-4 rounded-lg font-sans font-semibold text-lg transition-all duration-300 flex items-center space-x-2 group"
              >
                <span>Book Your Suite</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/suites"
                className="border-2 border-white text-white hover:bg-white hover:text-[#161616] px-8 py-4 rounded-lg font-sans font-semibold text-lg transition-all duration-300"
              >
                View All Suites
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* About WESTBURY HOMES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif font-bold text-[#161616] mb-6">
                Welcome to WESTBURY HOMES
              </h2>
              <p className="text-lg text-body text-[#838FBF] mb-6 font-sans">
                Experience the pinnacle of luxury living with WESTBURY HOMES—a
                fusion of elegance and modern design. Our meticulously crafted
                apartments, strategically located for convenience and
                tranquility, offer a perfect blend of style and functionality.
              </p>
              <p className="text-lg text-bodytext-[#838FBF] mb-8 font-sans">
                Discover a range of residences tailored to diverse
                preferences—whether you desire a serene retreat, a dynamic urban
                dwelling, or a vibrant community. Join us in redefining the art
                of living and embrace the prestige of Westbury Homes. Your dream
                apartment awaits—where luxury meets lifestyle!
              </p>
              <Link
                to="/about"
                className="bg-[#710014] hover:bg-[#161616] text-white px-6 py-3 rounded-lg font-sans font-semibold transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>Learn More</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={ExteriorNight}
                alt="WESTBURY HOMES Exterior"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Suites */}
      <section className="py-20 bg-[#F2F1ED]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-[#161616] mb-4">
              Our Premium Suites
            </h2>
            <p className="text-xl text-body font-sans">
              Discover our collection of luxury accommodations
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-10 h-10 border-4 border-t-[#710014] border-gray-300 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSuites.slice(0, 3).map((suite, index) => {
                let imageUrl =
                  Array.isArray(suite.images) && suite.images.length > 0
                    ? suite.images[0]
                    : null;

                if (imageUrl && imageUrl.startsWith("client/src/Images/IMAGES/")) {
                  const imageName = imageUrl.split("/").pop();
                  imageUrl = new URL(
                    `../Images/IMAGES/${imageName}`,
                    import.meta.url
                  ).href;
                } else {
                  imageUrl =
                    suiteImageMap[suite.title] ||
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80";
                }

                return (
                  <motion.div
                    key={suite.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={suite.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#161616] px-3 py-2 rounded-lg font-sans font-bold">
                        ${suite.price}/night
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-serif font-semibold text-[#161616] mb-2">
                        {suite.title}
                      </h3>
                      <p className="text-body font-sans text-sm mb-4">
                        {suite.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-[#838FBF] font-sans text-sm">
                          <div className="flex items-center">
                            <Users size={16} className="mr-1" />
                            <span>{suite.bedrooms} Bedrooms</span>
                          </div>
                          <div className="flex items-center">
                            <Coffee size={16} className="mr-1" />
                            <span>{suite.bathrooms} Bathrooms</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star
                            size={16}
                            className="text-[#710014] fill-current"
                          />
                          <span className="text-[#161616] font-sans font-semibold ml-1">
                            4.9
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/suites/${suite.id}`}
                        className="w-full bg-[#710014] hover:bg-[#161616] text-white py-3 rounded-lg font-sans font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/suites"
              className="bg-[#838FBF] hover:bg-[#710014] text-white px-8 py-3 rounded-lg font-sans font-semibold transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>View All Suites</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities */}      {/* Amenities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-[#161616] mb-4">
              World-Class Amenities
            </h2>
            <p className="text-xl text-[#838FBF] font-sans">
              Everything you need for the perfect stay
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wifi, title: 'High-Speed WiFi', description: 'Complimentary high-speed internet throughout the property' },
              { icon: Car, title: 'Secure Parking', description: '24/7 secure parking with CCTV surveillance' },
              { icon: Coffee, title: 'Kitchen Facilities', description: 'Fully equipped kitchens in all suites' },
              { icon: Users, title: 'Concierge Service', description: '24/7 concierge service for all your needs' }
            ].map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-[#F2F1ED] hover:bg-[#710014] hover:text-white transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-[#710014] group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <amenity.icon size={32} className="text-white group-hover:text-[#710014]" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-white">
                  {amenity.title}
                </h3>
                <p className="text-[#838FBF] group-hover:text-white/80 font-sans">
                  {amenity.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-[#F2F1ED]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif font-bold text-[#161616] mb-6">
                Prime Location
              </h2>
              <p className="text-lg text-[#838FBF] mb-6 font-sans">
                WESTBURY HOMES is strategically located in the heart of Accra's most prestigious neighborhood, 
                offering easy access to business districts, shopping centers, and cultural attractions.
              </p>
              <div className="flex items-center text-[#838FBF] font-sans">
                <MapPin size={20} className="mr-2 text-[#710014]" />
                <span>Westbury Homes, Trasacco East Legon</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.3837941518095!2d-0.11869361643680673!3d5.657499116619211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf834431c59fbb%3A0x2d857abfad2b3382!2sWestbury%20Homes!5e0!3m2!1sen!2sgh!4v1754597629618!5m2!1sen!2sgh" 
                    width="100%" 
                    height="300" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Westbury Homes Location"
                    className="w-full"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#710014] to-[#161616] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-6">
              Ready to Experience Luxury?
            </h2>
            <p className="text-xl text-[#838FBF] mb-8 font-sans max-w-2xl mx-auto">
              Book your stay at WESTBURY HOMES and discover the perfect blend of comfort, 
              luxury, and exceptional service.
            </p>
            <Link
              to="/booking"
              className="bg-white text-[#710014] hover:bg-[#F2F1ED] px-8 py-4 rounded-lg font-sans font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>Book Your Suite Now</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
    
  );
};

export default Home;
