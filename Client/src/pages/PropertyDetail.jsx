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
  //eslint-disable-next-line
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
//eslint-disable-next-line
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
            className="bg-[#710014] hover:bg-[#161616] text-white px-6 py-3 rounded-lg font-sans font-semibold transition-all duration-300"
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

        {/* Rest of your JSX (Gallery, Features, Description, Amenities, Sidebar) stays the same */}
      </div>
    </div>
  );
};

export default PropertyDetail;
