import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'users', label: 'Users', icon: Users },
];

const EVENT_FILTERS = ['all', 'pending', 'approved', 'rejected'];

const ROLE_OPTIONS = ['attendee', 'organizer', 'admin'];

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

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [eventFilter, setEventFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const authHeaders = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/events`, authHeaders),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, authHeaders),
      ]);
      setEvents(eventsRes.data.events || []);
      setUsers(usersRes.data.users || []);
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message: 'Failed to load dashboard data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const stats = useMemo(() => {
    const byStatus = { pending: 0, approved: 0, rejected: 0 };
    const byCategory = {};
    events.forEach((e) => {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      if (e.category) byCategory[e.category] = (byCategory[e.category] || 0) + 1;
    });
    return { byStatus, byCategory, total: events.length };
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter((e) => e.status === eventFilter);
  }, [events, eventFilter]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const handleStatusChange = async (eventId, status) => {
    setActionLoading(eventId);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/events/${eventId}/status`,
        { status },
        authHeaders
      );
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, status } : e))
      );
      setNotification({ type: 'success', message: `Event ${status}.` });
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update event status.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setActionLoading(userId);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`,
        { role },
        authHeaders
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u))
      );
      setNotification({ type: 'success', message: `Role updated to ${role}.` });
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update role.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[radial-gradient(circle_at_center,_#1f2124_0%,_#131517_100%)] text-white font-sans selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="md:sticky md:top-20 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-3 flex md:flex-col gap-1.5 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#f2ca77]/10 text-[#f2ca77] border border-[#f2ca77]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 min-w-0 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Dashboard
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Manage events, users and platform activity.
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
                Loading dashboard...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                      icon={CalendarDays}
                      label="Total Events"
                      value={stats.total}
                    />
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
                    <StatCard icon={Users} label="Total Users" value={users.length} />
                  </div>

                  {/* Category breakdown */}
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 md:p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
                      Events by Category
                    </h3>
                    {Object.keys(stats.byCategory).length === 0 ? (
                      <p className="text-xs text-white/30">No events yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(stats.byCategory)
                          .sort((a, b) => b[1] - a[1])
                          .map(([category, count]) => (
                            <div key={category} className="flex items-center gap-3">
                              <span className="text-xs text-white/60 w-24 shrink-0 truncate">
                                {category}
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                                <div
                                  className="h-full bg-[#f2ca77] rounded-full transition-all duration-500"
                                  style={{
                                    width: `${(count / stats.total) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-white/40 w-6 text-right shrink-0">
                                {count}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-5">
                  {/* Filter pills */}
                  <div className="flex flex-wrap gap-2">
                    {EVENT_FILTERS.map((f) => {
                      const count =
                        f === 'all' ? stats.total : stats.byStatus[f] || 0;
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
                      No events found for this filter.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {filteredEvents.map((event) => (
                        <div
                          key={event._id}
                          className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4"
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
                              {event.organizer?.name && (
                                <span>
                                  Host:{' '}
                                  <span className="text-white/70">
                                    {event.organizer.name}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {event.status !== 'approved' && (
                              <button
                                onClick={() =>
                                  handleStatusChange(event._id, 'approved')
                                }
                                disabled={actionLoading === event._id}
                                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-40"
                              >
                                Approve
                              </button>
                            )}
                            {event.status !== 'rejected' && (
                              <button
                                onClick={() =>
                                  handleStatusChange(event._id, 'rejected')
                                }
                                disabled={actionLoading === event._id}
                                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-40"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-5">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/40 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-white/20 outline-none transition-all duration-200"
                    />
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-12 text-center text-xs text-white/40">
                      No users found.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {filteredUsers.map((u) => (
                        <div
                          key={u._id}
                          className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#f2ca77] text-black font-bold flex items-center justify-center text-xs shrink-0">
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-white/40 truncate">
                              {u.email}
                            </div>
                          </div>
                          <div className="text-[10px] text-white/30 font-mono hidden sm:block shrink-0">
                            {u.createdAt
                              ? `Joined ${new Date(u.createdAt).toLocaleDateString(
                                  [],
                                  { month: 'short', day: 'numeric', year: 'numeric' }
                                )}`
                              : ''}
                          </div>
                          <select
                            value={u.role}
                            disabled={actionLoading === u._id}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none cursor-pointer disabled:opacity-40 shrink-0"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r} className="bg-[#131517] text-white capitalize">
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
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

export default AdminDashboardPage;
