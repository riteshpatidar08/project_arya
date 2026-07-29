import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  LogOut,
  Sparkles,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import HeroSection from '../component/HeroSection';

function Homepage() {
  const [eventData, setEventData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch (e) {
      return {};
    }
  });

  const categories = [
    'Technology',
    'Social',
    'Workshop',
    'Entertainment',
    'Sports',
    'Art',
    'Other',
  ];

  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const userRole = currentUser?.role || localStorage.getItem('role');
  const isOrganizer = userRole === 'organizer';

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
        setEventData(res.data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setNotification({
          type: 'error',
          message: 'Failed to fetch events from the network.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, []);

  // Filter events based on selectedCategories and searchQuery
  useEffect(() => {
    let result = eventData;

    if (selectedCategories.length > 0) {
      result = result.filter(
        (event) =>
          event.category &&
          selectedCategories.some(
            (cat) => cat.toLowerCase() === event.category.toLowerCase()
          )
      );
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(result);
  }, [eventData, selectedCategories, searchQuery]);

  // Clear notification automatically after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleBookEvent = async (eventId) => {
    setBookingLoading(eventId);
    setNotification(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookevent/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Instantly update attendee list in local state
      setEventData((prevEvents) =>
        prevEvents.map((evt) => {
          if (evt._id === eventId) {
            const currentUserId = currentUser?._id;
            const updatedAttendees = evt.attendee ? [...evt.attendee] : [];
            if (currentUserId && !updatedAttendees.includes(currentUserId)) {
              updatedAttendees.push(currentUserId);
            }
            return { ...evt, attendee: updatedAttendees };
          }
          return evt;
        })
      );

      setNotification({
        type: 'success',
        message: response.data.message || 'Booking confirmed successfully!',
      });
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message || 'Failed to book the event.';
      setNotification({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setBookingLoading(null);
    }
  };

  const getCategoryStyles = (category) => {
    const cat = category?.toLowerCase();
    switch (cat) {
      case 'technology':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'social':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'workshop':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'entertainment':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'sports':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'art':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-white/[0.04] text-white/60 border-white/[0.08]';
    }
  };

  return (
    <div className="min-h-[90vh] bg-[radial-gradient(circle_at_center,_#1f2124_0%,_#131517_100%)] text-white font-sans p-4 md:p-8 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto">
        {/* Notification Alert Banner */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-xs transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {notification.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{notification.message}</div>
            <button
              onClick={() => setNotification(null)}
              className="text-white/30 hover:text-white/60 transition-colors font-bold text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Full-width Hero Carousel Section */}
        <HeroSection
          events={eventData}
          currentUser={currentUser}
          isOrganizer={isOrganizer}
          onBookEvent={handleBookEvent}
          bookingLoading={bookingLoading}
        />

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: filter category */}
          <div className="lg:col-span-1 sticky top-20 flex flex-col gap-6">
            {/* "filter category" sidebar block */}
            <div className="px-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-3">
                Filter Category
              </label>
              <div className="flex flex-row overflow-x-auto pb-3 gap-4 lg:flex-col lg:overflow-visible lg:pb-0 lg:gap-3 select-none scrollbar-thin">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      onClick={() => handleToggleCategory(cat)}
                      className="flex items-center gap-2.5 cursor-pointer text-xs text-white/70 hover:text-white transition-colors duration-150 py-0.5 whitespace-nowrap"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                          isChecked
                            ? 'border-[#f2ca77] bg-[#f2ca77]/10 text-[#f2ca77]'
                            : 'border-white/20 bg-white/[0.02] hover:border-white/40'
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-2.5 h-2.5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>
                      <span>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: search & event list */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* "search" block */}

            <div className="space-y-2.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block">
                Search Events
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search by title, description or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/40 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Event List ("event 1", "event 2") */}
            <div>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  <p className="text-xs text-white/40 font-medium">
                    Loading events...
                  </p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white/30" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      No Events Found
                    </h3>
                    <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">
                      We couldn't find any approved events matching your search or category filters.
                    </p>
                  </div>
                  {(selectedCategories.length > 0 || searchQuery !== '') && (
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setSearchQuery('');
                      }}
                      className="text-xs text-[#f2ca77] hover:underline cursor-pointer"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group flex flex-col md:flex-row items-stretch shadow-md relative"
                    >
                      {/* Event Banner */}
                      <div className="w-full md:w-44 h-48 md:h-auto shrink-0 relative overflow-hidden bg-white/[0.01] border-b md:border-b-0 md:border-r border-white/[0.08]">
                        {event.bannerUrl ? (
                          <img
                            src={event.bannerUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.05] text-white/20 gap-2">
                            <Calendar className="w-8 h-8" />
                            <span className="text-[10px] uppercase tracking-wider font-mono">
                              {event.category || 'Event'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryStyles(
                                event.category
                              )}`}
                            >
                              {event.category || 'Other'}
                            </span>
                            <span className="text-[10px] text-white/30 font-mono">
                              Capacity: {event.attendee?.length || 0} /{' '}
                              {event.capacity || '∞'}
                            </span>
                          </div>
                          <h3 className="text-base font-bold tracking-tight text-white group-hover:text-[#f2ca77] transition-colors duration-200">
                            {event.title}
                          </h3>
                          <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        {/* Event Metadata (Footer of row) */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-white/[0.04] text-[11px] text-white/40">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-white/25" />
                            <span>
                              {new Date(event.date).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              at{' '}
                              {new Date(event.date).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-white/25" />
                            <span className="truncate max-w-[180px]">
                              {event.location}
                            </span>
                          </div>
                          {event.organizer?.name && (
                            <div className="flex items-center gap-1.5 ml-auto">
                              <span className="text-white/20">Host:</span>
                              <span className="text-white/60 font-medium">
                                {event.organizer.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Navigation Link to Event Details */}
                      <div className="p-5 md:p-6 shrink-0 flex items-center justify-end md:justify-center border-t md:border-t-0 md:border-l border-white/[0.04] bg-white/[0.01]">
                        <button
                          onClick={() => navigate(`/event/${event._id}`)}
                          className="w-full md:w-auto text-[#f2ca77] hover:text-[#f2ca77]/80 hover:bg-[#f2ca77]/10 border border-[#f2ca77]/30 px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                        >
                          <span>Click here to register</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;