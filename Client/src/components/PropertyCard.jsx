import React from 'react';
import { Link } from 'react-router-dom';
//eslint-disable-next-line
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star, 
  Heart,
  Users,
  Wifi,
  Car,
  Coffee
} from 'lucide-react';

// ✅ Import images at the top
import KARR from '../Images/IMAGES/KARR.JPG';
import RONY from '../Images/IMAGES/RONY.JPG';
import ALLY from '../Images/IMAGES/ALLY.JPG';
import EBB from '../Images/IMAGES/EBB.JPG';
import KIKI from '../Images/IMAGES/KIKI.JPG';
import LIZ from '../Images/IMAGES/LIZ.JPG';
import MIMI from '../Images/IMAGES/MIMI.JPG';

const SuiteCard = ({ suite }) => {
  if (!suite?.id) {
    console.warn('SuiteCard received invalid suite:', suite);
    return null;
  }

  try {
    const {
      id,
      title = 'Luxury Suite',
      price = 0,
      bedrooms = 0,
      bathrooms = 0,
      area_sqm,
      size,
      location = 'WESTBURY HOMES, Accra',
      amenities = [],
      featured = false,
      images = []
    } = suite;

    // ✅ Map suite names to images
    const suiteImageMap = {
      'KARR - 1 Bedroom Penthouse': KARR,
      'RONY - 1 Bedroom Penthouse': RONY,
      'ALLY - 2 Bedroom Plus Ensuite': ALLY,
      'EBB - 2 Bedroom Standard Ensuite': EBB,
      'KIKI - 2 Bedroom Penthouse': KIKI,
      'LIZ - 2 Bedroom Standard Ensuite': LIZ,
      'MIMI - 2 Bedroom Plus Ensuite': MIMI,
    };

    // ✅ Use provided image or fallback to suite mapping
    let imageUrl = Array.isArray(images) && images.length > 0 
      ? images[0] 
      : suiteImageMap[title] || KARR;

    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(price || 0);
    };

    const getAmenityIcon = (amenity) => {
      const iconMap = {
        'WiFi': <Wifi size={16} />,
        'Parking': <Car size={16} />,
        'Kitchen': <Coffee size={16} />,
      };
      return iconMap[amenity] || <Users size={16} />;
    };

    const displayAmenities = Array.isArray(amenities) ? amenities.slice(0, 4) : [];

    return (
      <motion.div whileHover={{ y: -5 }} className="card overflow-hidden group hover-lift">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = KARR; }}
          />

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 left-4 bg-[#710014] text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-4 right-16 bg-white/90 text-[#161616] px-3 py-2 rounded-lg font-bold">
            {formatPrice(price)}/night
          </div>

          {/* Favorite Button */}
          <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white">
            <Heart size={18} className="text-[#838FBF] hover:text-[#710014]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-garamond font-semibold text-[#161616] mb-2 group-hover:text-[#710014] transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin size={16} className="mr-1" />
            <span>{location}</span>
          </div>

          {/* Suite Details */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-700">
            <div className="flex space-x-4">
              <div className="flex items-center"><Bed size={16} className="mr-1" />{bedrooms}</div>
              <div className="flex items-center"><Bath size={16} className="mr-1" />{bathrooms}</div>
              <div className="flex items-center"><Square size={16} className="mr-1" />{area_sqm || size || 0} sqm</div>
            </div>
            <div className="flex items-center"><Star size={16} className="text-[#710014]" /><span className="ml-1">4.9</span></div>
          </div>

          {/* Amenities */}
          {displayAmenities.length > 0 && (
            <div className="flex space-x-2 mb-4">
              {displayAmenities.map((amenity, i) => (
                <div key={i} className="flex items-center text-xs text-[#838FBF]">
                  {getAmenityIcon(amenity)}<span className="ml-1">{amenity}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Link to={`/suites/${id}`} className="bg-[#710014] hover:bg-[#161616] text-white px-4 py-2 rounded-lg font-semibold transition">
              View Details
            </Link>
            <Link to="/booking" className="border-2 border-[#710014] text-[#710014] hover:bg-[#710014] hover:text-white px-4 py-2 rounded-lg font-semibold transition">
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>
    );
  } catch (error) {
    console.error('Error rendering SuiteCard:', error, suite);
    return <div className="card p-6 text-center text-[#838FBF]">Error loading suite</div>;
  }
};

export default SuiteCard;
