import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Check,
  Ticket,
  X,
} from 'lucide-react';

function MyBookingsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const authHeaders = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const fetchMyBookings = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-bookings`,
        authHeaders
      );
      setEvents(res.data.events || []);
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message: 'Failed to load your bookings.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const upcoming = [];
    const past = [];
    events.forEach((e) => {
      if (e.date && new Date(e.date).getTime() < now) {
        past.push(e);
      } else {
        upcoming.push(e);
      }
    });
    return { upcoming, past };
  }, [events]);

  const handleCancel = async (eventId) => {
    setCancelingId(eventId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/bookevent/${eventId}`,
        authHeaders
      );
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setNotification({ type: 'success', message: 'Booking cancelled.' });
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to cancel booking.',
      });
    } finally {
      setCancelingId(null);
    }
  };

  const renderEventCard = (event, { pastEvent = false } = {}) => (
    <div
      key={event._id}
      className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4"
    >
      <div
        onClick={() => navigate(`/event/${event._id}`)}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">
            {event.category}
          </span>
          {pastEvent && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider bg-white/[0.04] text-white/40 border-white/[0.08]">
              Past
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-white mt-1.5 truncate hover:text-[#f2ca77] transition-colors">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] text-white/40">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {event.date
              ? `${new Date(event.date).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })} at ${new Date(event.date).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}`
              : 'TBA'}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {event.attendee?.length || 0} / {event.capacity ?? '∞'}
          </span>
          {event.organizer?.name && (
            <span>
              Host: <span className="text-white/70">{event.organizer.name}</span>
            </span>
          )}
        </div>
      </div>

      {!pastEvent && (
        <button
          onClick={() => handleCancel(event._id)}
          disabled={cancelingId === event._id}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-40"
        >
          <X className="w-3.5 h-3.5" />
          {cancelingId === event._id ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-[90vh] bg-[radial-gradient(circle_at_center,_#1f2124_0%,_#131517_100%)] text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            My Bookings
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Events you have registered for.
          </p>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs transition-all duration-300 ${
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
            <p className="text-xs text-white/40 font-medium">
              Loading your bookings...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white/30" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                No Bookings Yet
              </h3>
              <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">
                Events you register for will show up here.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#f2ca77] hover:underline cursor-pointer"
            >
              Discover events
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Upcoming ({upcoming.length})
              </h3>
              {upcoming.length === 0 ? (
                <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-8 text-center text-xs text-white/40">
                  No upcoming bookings.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcoming.map((event) => renderEventCard(event))}
                </div>
              )}
            </div>

            {past.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Past ({past.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {past.map((event) => renderEventCard(event, { pastEvent: true }))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
