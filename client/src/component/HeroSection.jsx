import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Sparkles, Users, ArrowRight, Check } from 'lucide-react';

function HeroSection({ events = [], currentUser = {}, isOrganizer = false, onBookEvent, bookingLoading = null }) {
  // Filter for upcoming events (date is in future or sort by date)
  const upcomingEvents = events.length > 0 
    ? [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto slide every 5 seconds if multiple events exist
  useEffect(() => {
    if (!isAutoplay || upcomingEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay, upcomingEvents.length]);

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev === 0 ? upcomingEvents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
  };

  const currentEvent = upcomingEvents[currentIndex];

  if (upcomingEvents.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ca77]/10 border border-[#f2ca77]/20 text-[#f2ca77] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming Events Spotlight</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Discover & Attend Amazing Gatherings
            </h2>
            <p className="text-xs md:text-sm text-white/60 max-w-xl">
              Stay tuned! Upcoming featured events will be showcased right here. Explore and connect with creators and leaders across the network.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isRegistered = currentEvent?.attendee?.includes(currentUser?._id);

  return (
    <div 
      className="w-full relative rounded-3xl overflow-hidden mb-8 border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] shadow-2xl group"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* Background Banner with blur / overlay */}
      <div className="relative min-h-[360px] md:min-h-[420px] flex flex-col justify-end p-6 md:p-10">
        {currentEvent.bannerUrl ? (
          <img
            src={currentEvent.bannerUrl}
            alt={currentEvent.title}
            className="absolute inset-0 w-full h-full object-cover opacity-35 transition-all duration-700 scale-105 group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-black opacity-80" />
        )}

        {/* Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131517] via-[#131517]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#131517] via-transparent to-[#131517]/50" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ca77] text-black font-extrabold text-[11px] uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Upcoming Event
            </span>
            {currentEvent.category && (
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[11px] font-semibold uppercase tracking-wider">
                {currentEvent.category}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            {currentEvent.title}
          </h1>

          <p className="text-xs md:text-sm text-white/70 line-clamp-2 leading-relaxed max-w-2xl">
            {currentEvent.description}
          </p>

          {/* Event Metadata Pill Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 pt-2">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl">
              <Calendar className="w-4 h-4 text-[#f2ca77]" />
              <span>
                {new Date(currentEvent.date).toLocaleDateString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {new Date(currentEvent.date).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {currentEvent.location && (
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-[#f2ca77]" />
                <span className="truncate max-w-[200px]">{currentEvent.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl">
              <Users className="w-4 h-4 text-[#f2ca77]" />
              <span>
                {currentEvent.attendee?.length || 0} / {currentEvent.capacity || '∞'} Attending
              </span>
            </div>
          </div>

          {/* CTA Action */}
          {!isOrganizer && (
            <div className="pt-3">
              {isRegistered ? (
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-6 py-3 rounded-2xl font-bold text-xs">
                  <Check className="w-4 h-4" />
                  <span>You're Registered for this Event!</span>
                </div>
              ) : (
                <button
                  onClick={() => onBookEvent && onBookEvent(currentEvent._id)}
                  disabled={bookingLoading === currentEvent._id}
                  className="bg-[#f2ca77] text-black hover:bg-[#e0b764] active:scale-[0.98] px-6 py-3 rounded-2xl font-extrabold text-xs transition-all duration-200 shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading === currentEvent._id ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      <span>Reserving Spot...</span>
                    </>
                  ) : (
                    <>
                      <span>Reserve Your Spot Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Carousel Controls */}
      {upcomingEvents.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous Event"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 group-hover:opacity-100 cursor-pointer"
            aria-label="Next Event"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {upcomingEvents.map((evt, idx) => (
              <button
                key={evt._id || idx}
                onClick={() => {
                  setIsAutoplay(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-[#f2ca77]'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HeroSection;
