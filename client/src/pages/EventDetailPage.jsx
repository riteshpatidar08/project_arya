import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Mail,
  Lock,
} from 'lucide-react';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [singleEvent, setSingleEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Registration Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchEventById = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/events/${id}`
        );
        setSingleEvent(res.data.event || res.data);
      } catch (error) {
        console.log(error);
        setNotification({
          type: 'error',
          message: 'Failed to fetch event details.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventById();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(formData)

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
     
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookevent/${id}`,
        formData,
     
      );

      setNotification({
        type: 'success',
        message: res.data.message || 'Successfully registered for this event!',
      });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message:
          error.response?.data?.message || 'Failed to complete registration.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-[radial-gradient(circle_at_center,_#1f2124_0%,_#131517_100%)] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#f2ca77] animate-spin mb-3"></div>
        <p className="text-xs text-white/50 font-medium">
          Loading event details...
        </p>
      </div>
    );
  }

  if (!singleEvent) {
    return (
      <div className="min-h-[80vh] bg-[radial-gradient(circle_at_center,_#1f2124_0%,_#131517_100%)] flex flex-col items-center justify-center text-white p-6">
        <p className="text-sm text-white/60 mb-4">Event not found.</p>
        <button
          onClick={() => navigate('/')}
          className="text-xs text-[#f2ca77] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-[radial-gradient(circle_at_center,_#1f2124_0%,_#131517_100%)] text-white font-sans p-4 md:p-8 selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        {/* Alert Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-xs transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
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

        {/* Main Event Card */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Event Banner */}
          <div className="w-full h-64 md:h-80 relative overflow-hidden bg-white/[0.01]">
            {singleEvent.bannerUrl ? (
              <img
                src={singleEvent.bannerUrl}
                alt={singleEvent.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black text-white/20 gap-3">
                <Calendar className="w-12 h-12" />
                <span className="text-xs uppercase tracking-wider font-mono">
                  {singleEvent.category || 'Nexus Event'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#131517] via-[#131517]/40 to-transparent" />
          </div>

          {/* Details Content */}
          <div className="p-6 md:p-10 space-y-6">
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-3">
              {singleEvent.category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[#f2ca77]/30 bg-[#f2ca77]/10 text-[#f2ca77] uppercase tracking-wider">
                  {singleEvent.category}
                </span>
              )}
              {singleEvent.organizer?.name && (
                <span className="text-xs text-white/40 font-mono">
                  Hosted by{' '}
                  <strong className="text-white/80">
                    {singleEvent.organizer.name}
                  </strong>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {singleEvent.title}
            </h1>

            {/* Event Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#f2ca77] shrink-0" />
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                    Date & Time
                  </div>
                  <div className="text-xs text-white/90 font-medium">
                    {singleEvent.date
                      ? `${new Date(singleEvent.date).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })} at ${new Date(singleEvent.date).toLocaleTimeString(
                          [],
                          {
                            hour: 'numeric',
                            minute: '2-digit',
                          }
                        )}`
                      : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#f2ca77] shrink-0" />
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                    Location
                  </div>
                  <div className="text-xs text-white/90 font-medium truncate max-w-[180px]">
                    {singleEvent.location || 'Online / TBD'}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3">
                <Users className="w-5 h-5 text-[#f2ca77] shrink-0" />
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                    Capacity
                  </div>
                  <div className="text-xs text-white/90 font-medium">
                    {singleEvent.attendee?.length || 0} /{' '}
                    {singleEvent.capacity || '∞'} Seats Taken
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                About This Event
              </h3>
              <p className="text-xs md:text-sm text-white/60 leading-relaxed whitespace-pre-line">
                {singleEvent.description ||
                  'No detailed description available.'}
              </p>
            </div>

            {/* Register Action Button */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-[#f2ca77] text-black hover:bg-[#e0b764] active:scale-[0.98] px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-xl cursor-pointer"
              >
                Register for this Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181a1d] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f2ca77]" />
                <h2 className="text-lg font-bold text-white">
                  Event Registration
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#f2ca77] focus:ring-1 focus:ring-[#f2ca77] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#f2ca77] focus:ring-1 focus:ring-[#f2ca77] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#f2ca77] focus:ring-1 focus:ring-[#f2ca77] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#f2ca77] hover:bg-[#e0b764] text-black py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;
