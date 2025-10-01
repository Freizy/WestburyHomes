import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Star, Users, Award, Heart } from 'lucide-react';

// ✅ Import images at the top
import ExteriorDay from '../Images/IMAGES/EXTERIOR DAY.JPG';
import AboutImage from '../Images/IMAGES/about.JPG';

const About = () => {
  return (
    <div className="min-h-screen bg-[#F2F1ED] pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#710014] to-[#161616] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-garamond font-bold mb-6 tracking-wide">
              About WESTBURY HOMES
            </h1>
            <p className="text-xl md:text-2xl font-sans text-[#838FBF] mb-8 font-light">
              Where luxury meets comfort in the heart of Accra
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-garamond font-bold text-[#161616] mb-6">
                Our Story
              </h2>
              <p className="text-lg text-[#838FBF] mb-6 font-sans">
                WESTBURY HOMES was born from a vision to create the most exceptional 
                luxury accommodation experience in Accra. Located in the prestigious 
                East Legon neighborhood, our property represents the pinnacle of 
                sophisticated urban living.
              </p>
              <p className="text-lg text-[#838FBF] mb-6 font-sans">
                Every suite and flat has been meticulously designed to provide our 
                guests with an unparalleled combination of comfort, style, and 
                world-class amenities. From our studio suites to our premium 
                penthouses, each accommodation reflects our commitment to excellence.
              </p>
              <p className="text-lg text-[#838FBF] font-sans">
                We believe that luxury is not just about beautiful spaces, but about 
                creating memorable experiences that exceed expectations and make every 
                stay truly special.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={ExteriorDay}
                alt="WESTBURY HOMES Building"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
              WESTBURY HOMES by the Numbers
            </h2>
            <p className="text-xl text-body font-sans">
              Excellence in every detail
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, number: '25+', label: 'Luxury Suites & Flats' },
              { icon: Star, number: '4.9', label: 'Guest Rating' },
              { icon: Award, number: '100%', label: 'Satisfaction Rate' },
              { icon: Heart, number: '500+', label: 'Happy Guests' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-[#710014] rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={32} className="text-white" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#161616] mb-2">
                  {stat.number}
                </div>
                <div className="text-body font-sans">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* Features Section */}
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
        What Makes Us Special
      </h2>
      <p className="text-xl text-gray-600 font-sans">
        Discover the WESTBURY HOMES difference
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          title: 'Prime Location',
          description:
            'Situated in the prestigious East Legon neighborhood, offering easy access to business districts, shopping centers, and cultural attractions.',
          icon: '📍',
        },
        {
          title: 'Luxury Design',
          description:
            'Each suite features contemporary design with premium finishes, creating an atmosphere of sophisticated elegance.',
          icon: '✨',
        },
        {
          title: 'World-Class Amenities',
          description:
            'From high-speed WiFi to secure parking, every amenity is designed to enhance your stay and provide ultimate comfort.',
          icon: '🏆',
        },
        {
          title: 'Exceptional Service',
          description:
            'Our dedicated team is committed to providing personalized service that exceeds your expectations.',
          icon: '👥',
        },
        {
          title: 'Safety & Security',
          description:
            '24/7 security with CCTV surveillance ensures your peace of mind throughout your stay.',
          icon: '🔒',
        },
        {
          title: 'Flexible Accommodation',
          description:
            'Choose from studio suites to premium penthouses, each designed to meet different needs and preferences.',
          icon: '🏠',
        },
      ].map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="p-6 bg-[#F2F1ED] rounded-2xl transition-all duration-300 group hover:bg-[#710014]"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>
          <h3 className="text-xl font-serif font-semibold mb-3 text-[#161616] group-hover:text-white">
            {feature.title}
          </h3>
          <p className="text-gray-600 group-hover:text-white/80 font-sans">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Values Section */}
      <section className="py-20 bg-[#F2F1ED]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={AboutImage}
                alt="WESTBURY HOMES Interior"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif font-bold text-[#161616] mb-6">
                Our Values
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-[#161616] mb-2">
                    Excellence
                  </h3>
                  <p className="text-[#838FBF] font-sans">
                    We strive for excellence in every aspect of our service, from the design of our suites 
                    to the quality of our amenities and the professionalism of our staff.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-[#161616] mb-2">
                    Hospitality
                  </h3>
                  <p className="text-[#838FBF] font-sans">
                    We believe in creating warm, welcoming environments where every guest feels valued 
                    and cared for throughout their stay.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-[#161616] mb-2">
                    Innovation
                  </h3>
                  <p className="text-[#838FBF] font-sans">
                    We continuously innovate to provide the latest amenities and services that enhance 
                    the guest experience and exceed expectations.
                  </p>
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
              Experience WESTBURY HOMES
            </h2>
            <p className="text-xl text-[#838FBF] mb-8 max-w-2xl mx-auto font-sans">
              Book your stay and discover why WESTBURY HOMES is the preferred choice 
              for luxury accommodation in Accra.
            </p>
            <Link
              to="/booking"
              className="bg-white text-[#710014] hover:bg-[#F2F1ED] px-8 py-4 rounded-lg font-sans font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>Book Your Suite</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
