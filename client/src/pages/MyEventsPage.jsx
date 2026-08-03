import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

const EVENT_FILTERS = ['all', 'pending', 'approved', 'rejected'];

function statusBadgeClasses(status) {
  switch (status) {
    case 'approved':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }
}

function MyEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [eventFilter, setEventFilter] = useState('all');

  useEffect(() => {
    const fetchMyEvents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/my-events`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        setEvents(res.data.events || []);
      } catch (error) {
        console.error(error);
        setNotification({
          type: 'error',
          message: 'Failed to load your events.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const stats = useMemo(() => {
    const byStatus = { pending: 0, approved: 0, rejected: 0 };
    let totalAttendees = 0;
    events.forEach((e) => {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      totalAttendees += e.attendee?.length || 0;
    });
    return { byStatus, total: events.length, totalAttendees };
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter((e) => e.status === eventFilter);
  }, [events, eventFilter]);

  return (
    <div className="min-h-[90vh] bg-[radial-gradient(circle_at_center,_#1f2124_0%,_#131517_100%)] text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              My Events
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Events you have created and their approval status.
            </p>
          </div>
          <button
            onClick={() => navigate('/createevent')}
            className="inline-flex items-center gap-2 bg-[#f2ca77] text-black hover:bg-[#e0b764] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Create Event
          </button>
        </div>

        {notification && (
          <div className="p-4 rounded-xl border flex items-start gap-3 text-xs bg-red-500/10 border-red-500/20 text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
              Loading your events...
            </p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard icon={CalendarDays} label="Total Events" value={stats.total} />
              <StatCard
                icon={Clock}
                label="Pending"
                value={stats.byStatus.pending}
                accent="text-amber-400"
              />
              <StatCard
                icon={CheckCircle2}
                label="Approved"
                value={stats.byStatus.approved}
                accent="text-emerald-400"
              />
              <StatCard
                icon={XCircle}
                label="Rejected"
                value={stats.byStatus.rejected}
                accent="text-red-400"
              />
              <StatCard icon={Users} label="Total Attendees" value={stats.totalAttendees} />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {EVENT_FILTERS.map((f) => {
                const count = f === 'all' ? stats.total : stats.byStatus[f] || 0;
                const active = eventFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setEventFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#f2ca77] text-black border-[#f2ca77]'
                        : 'bg-white/[0.03] text-white/60 border-white/[0.08] hover:text-white hover:border-white/20'
                    }`}
                  >
                    {f} ({count})
                  </button>
                );
              })}
            </div>

            {/* Event list */}
            {filteredEvents.length === 0 ? (
              <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-12 text-center text-xs text-white/40">
                {events.length === 0
                  ? "You haven't created any events yet."
                  : 'No events found for this filter.'}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/event/${event._id}`)}
                    className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadgeClasses(
                            event.status
                          )}`}
                        >
                          {event.status}
                        </span>
                        <span className="text-[10px] text-white/30 font-mono">
                          {event.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1.5 truncate">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] text-white/40">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date
                            ? new Date(event.date).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = 'text-[#f2ca77]' }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3">
      <Icon className={`w-5 h-5 shrink-0 ${accent}`} />
      <div>
        <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
          {label}
        </div>
        <div className="text-lg text-white font-bold">{value ?? 0}</div>
      </div>
    </div>
  );
}

export default MyEventsPage;
