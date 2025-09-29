import React, { useState, useEffect, useCallback } from 'react';
//eslint-disable-next-line
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SuiteCard from '../components/PropertyCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { getProperties, searchProperties } from '../services/api';

const Suites = () => {
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: ''
  });

  const fetchSuites = useCallback(async () => {
    try {
      setLoading(true);
      const params = { ...filters };

      // Remove empty values
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const data = await getProperties(params);
      setSuites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching suites:', error);
      setSuites([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSuites();
  }, [fetchSuites]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchProperties(filters);
      setSuites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching suites:', error);
      setSuites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: ''
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F2F1ED] pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#710014] to-[#161616] text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-garamond font-bold mb-6 tracking-wide">
                WESTBURY HOMES Suites
              </h1>
              <p className="text-xl md:text-2xl font-sans text-[#838FBF] mb-8 font-light">
                Choose from our exclusive collection of luxury suites and flats
              </p>

              {/* Search Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <select
                      value={filters.propertyType}
                      onChange={(e) =>
                        handleFilterChange('propertyType', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#838FBF] font-sans"
                    >
                      <option value="">Suite Name</option>
                      <option value="KARR - 1 Bedroom Penthouse">KARR - 1 Bedroom Penthouse</option>
                      <option value="RONY - 1 Bedroom Penthouse">RONY - 1 Bedroom Penthouse</option>
                      <option value="ALLY - 2 Bedroom Plus Ensuite">ALLY - 2 Bedroom Plus Ensuite</option>
                      <option value="EBB - 2 Bedroom Standard Ensuite">EBB - 2 Bedroom Standard Ensuite</option>
                      <option value="KIKI - 2 Bedroom Penthouse">KIKI - 2 Bedroom Penthouse</option>
                      <option value="LIZ - 2 Bedroom Standard Ensuite">LIZ - 2 Bedroom Standard Ensuite</option>
                      <option value="MIMI - 2 Bedroom Plus Ensuite">MIMI - 2 Bedroom Plus Ensuite</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) =>
                        handleFilterChange('bedrooms', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#838FBF] font-sans"
                    >
                      <option value="">Bedrooms</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange('minPrice', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#838FBF] font-sans"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange('maxPrice', e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#838FBF] font-sans"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleSearch}
                      className="w-full px-6 py-3 bg-[#838FBF] hover:bg-[#710014] text-white font-sans font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Search size={20} />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Suites Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#161616] mb-2">
                  {loading
                    ? 'Loading...'
                    : `${Array.isArray(suites) ? suites.length : 0} Suites Available`}
                </h2>
                {!loading && Array.isArray(suites) && suites.length > 0 && (
                  <p className="text-[#838FBF] mt-1 font-sans">
                    Luxury suites at WESTBURY HOMES, Accra
                  </p>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-[#838FBF] font-sans">Sort by:</span>
                <select className="px-3 py-2 border border-[#838FBF] rounded-lg focus:ring-2 focus:ring-[#710014] focus:border-transparent font-sans text-[#161616]">
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="w-10 h-10 border-4 border-t-transparent border-[#710014] rounded-full animate-spin"></div>
              </div>
            )}

            {/* No Results */}
            {!loading && (!Array.isArray(suites) || suites.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-[#838FBF] mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#161616] mb-2">
                  No suites found
                </h3>
                <p className="text-[#838FBF] mb-6 font-sans">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#710014] hover:bg-[#161616] text-white px-6 py-3 rounded-lg font-sans font-semibold transition-all duration-300"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}

            {/* Suites Grid */}
            {!loading && Array.isArray(suites) && suites.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {suites
                  .filter((suite) => suite && (suite._id || suite.id))
                  .map((suite, index) => (
                    <motion.div
                      key={suite._id || suite.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SuiteCard suite={suite} />
                    </motion.div>
                  ))}
              </motion.div>
            )}

            {/* Load More Button */}
            {!loading && Array.isArray(suites) && suites.length >= 9 && (
              <div className="text-center mt-12">
                <button className="bg-[#838FBF] hover:bg-[#710014] text-white px-8 py-3 rounded-lg font-sans font-semibold transition-all duration-300">
                  Load More Suites
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Suites;
