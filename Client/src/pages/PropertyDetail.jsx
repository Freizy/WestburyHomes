import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
//eslint-disable-next-line
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Bed, Bath, Square, Users, MapPin, Star, Heart,
  Wifi, Car, Coffee, Shield, Award, Phone, Mail
} from 'lucide-react';
import { getPropertyById } from '../services/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id); // api.js already unwraps .data
        setProperty(data || null);
      } catch (error) {
        console.error('Error fetching property:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      WiFi: <Wifi size={20} />,
      Parking: <Car size={20} />,
      Kitchen: <Coffee size={20} />,
      Pool: <Users size={20} />,
      Gym: <Users size={20} />,
      Spa: <Users size={20} />,
      Concierge: <Users size={20} />,
      Security: <Shield size={20} />,
      Balcony: <Users size={20} />,
      'Ocean View': <Users size={20} />,
      'Private Beach Access': <Users size={20} />,
      Garden: <Users size={20} />,
      "Chef's Kitchen": <Coffee size={20} />,
      Terraces: <Users size={20} />,
      'Business Center': <Users size={20} />,
      Restaurant: <Coffee size={20} />
    };
    return iconMap[amenity] || <Users size={20} />;
  };

  // Use public folder images (better than require)
  const suiteImageMap = {
    'KARR - 1 Bedroom Penthouse': '/Images/IMAGES/KARR.JPG',
    'RONY - 1 Bedroom Penthouse': '/Images/IMAGES/RONY.JPG',
    'ALLY - 2 Bedroom Plus Ensuite': '/Images/IMAGES/ALLY.JPG',
    'EBB - 2 Bedroom Standard Ensuite': '/Images/IMAGES/EBB.JPG',
    'KIKI - 2 Bedroom Penthouse': '/Images/IMAGES/KIKI.JPG',
    'LIZ - 2 Bedroom Standard Ensuite': '/Images/IMAGES/LIZ.JPG',
    'MIMI - 2 Bedroom Plus Ensuite': '/Images/IMAGES/MIMI.JPG',
    'Studio Suite': '/Images/IMAGES/KARR.JPG',
    'One Bedroom Suite': '/Images/IMAGES/RONY.JPG',
    'Two Bedroom Suite': '/Images/IMAGES/ALLY.JPG',
    'Penthouse Suite': '/Images/IMAGES/KIKI.JPG',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-[#161616] mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate('/properties')}
            className=" mt-6 md:mt-8 lg:mt-10 bg-[#710014] hover:bg-[#161616] text-white px-6 py-3 rounded-lg font-sans font-semibold transition-all duration-300"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  // Images from API
  const images = Array.isArray(property.images) ? property.images : [];
  let galleryImages = images.filter(img => img && img.startsWith('http'));

  // If no images, fallback to local mapped image or default
  if (galleryImages.length === 0) {
    galleryImages = [suiteImageMap[property.title] || '/Images/IMAGES/KARR.JPG'];
  }

  return (
    <div className="min-h-screen bg-[#F2F1ED]">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center text-[#710014] hover:text-[#161616] mb-6 transition-colors font-sans font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Properties
        </button>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Property Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-luxury mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#161616] mb-4">
                {property.title || 'Luxury Apartment'}
              </h1>
              <div className="flex items-center text-[#838FBF] font-sans mb-4">
                <MapPin size={20} className="mr-2" />
                <span>{property.location || 'Accra, Ghana'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star size={20} className="text-[#710014] fill-current" />
                  <span className="text-[#161616] font-sans font-semibold ml-1">4.8</span>
                </div>
                <span className="text-[#838FBF] font-sans">(24 reviews)</span>
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <div className="text-4xl font-serif font-bold text-[#710014] mb-2">
                <span className="text-2xl font-garamond font-bold text-[#710014]">
                  ${property.price?.toLocaleString() || 0}
                </span>
                <span className="ml-2 text-base text-[#838FBF]">/night</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={`/booking/${property.id}`}
                  className="bg-[#710014] hover:bg-[#161616] text-white px-8 py-3 rounded-lg font-sans font-semibold transition-all duration-300"
                >
                  Book Now
                </Link>
                <button className="border-2 border-[#710014] text-[#710014] hover:bg-[#710014] hover:text-white p-3 rounded-lg transition-all duration-300">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-luxury overflow-hidden"
            >
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={galleryImages[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300"
                    >
                      <ArrowLeft size={20} className="text-[#161616]" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300"
                    >
                      <ArrowLeft size={20} className="text-[#161616] rotate-180" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {galleryImages.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex ? 'border-[#710014]' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-luxury"
            >
              <h2 className="text-2xl font-serif font-bold text-[#161616] mb-6">Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Bed className="w-6 h-6 mr-3 text-[#710014]" />
                  <div>
                    <div className="font-semibold">{property.bedrooms || 0}</div>
                    <div className="text-sm">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Bath className="w-6 h-6 mr-3 text-[#710014]" />
                  <div>
                    <div className="font-semibold">{property.bathrooms || 0}</div>
                    <div className="text-sm">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Square className="w-6 h-6 mr-3 text-[#710014]" />
                  <div>
                    <div className="font-semibold">{property.area_sqm || property.size || 0}</div>
                    <div className="text-sm">sqm</div>
                  </div>
                </div>
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Users className="w-6 h-6 mr-3 text-[#710014]" />
                  <div>
                    <div className="font-semibold">{property.capacity || (property.bedrooms || 1) * 2}</div>
                    <div className="text-sm">Capacity</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-luxury"
            >
              <h2 className="text-2xl font-serif font-bold text-[#161616] mb-6">Description</h2>
              <p className="text-[#838FBF] font-sans leading-relaxed text-lg">
                {property.description || 'Experience luxury living at its finest with this exceptional property. This stunning apartment offers the perfect blend of comfort, style, and sophistication in one of Accra\'s most prestigious locations.'}
              </p>
            </motion.div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-8 shadow-luxury"
              >
                <h2 className="text-2xl font-serif font-bold text-[#161616] mb-6">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-[#838FBF] font-sans">
                      <div className="text-[#710014] mr-3">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-luxury"
            >
                              <h3 className="text-xl font-serif font-bold text-[#161616] mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Phone size={20} className="mr-3 text-[#710014]" />
                  <a href="tel:+233 558469564" className="hover:text-[#710014] transition-colors">
                    +233 558469564
                  </a>
                </div>
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Mail size={20} className="mr-3 text-[#710014]" />
                  <a href="mailto:info@westburyhomes.com" className="hover:text-[#710014] transition-colors">
                    info@westburyhomes.com
                  </a>
                </div>
              </div>
              <Link
                to="/booking"
                className="w-full bg-[#710014] hover:bg-[#161616] text-white px-6 py-3 rounded-lg font-sans font-semibold transition-all duration-300 mt-6 block text-center"
              >
                Book Now
              </Link>
            </motion.div>

            {/* Property Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-luxury"
            >
              <h3 className="text-xl font-serif font-bold text-[#161616] mb-4">Property Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Award size={20} className="mr-3 text-[#710014]" />
                  <span>Premium Location</span>
                </div>
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Shield size={20} className="mr-3 text-[#710014]" />
                  <span>24/7 Security</span>
                </div>
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Users size={20} className="mr-3 text-[#710014]" />
                  <span>Concierge Service</span>
                </div>
                <div className="flex items-center text-[#838FBF] font-sans">
                  <Wifi size={20} className="mr-3 text-[#710014]" />
                  <span>High-Speed Internet</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
