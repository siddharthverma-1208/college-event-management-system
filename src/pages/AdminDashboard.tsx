import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Event } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '../components/EmptyState';
import { Loading } from '../components/Loading';
import { cn } from '../utils/cn';

type Tab = 'overview' | 'events' | 'students';

export function AdminDashboard() {
  const {
    events,
    students,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteStudent,
    getRegistrationCount,
    addToast,
    theme
  } = useApp();
  
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'event' | 'student'; id: string } | null>(null);
  
  // Event form
  const [eventForm, setEventForm] = useState({
    eventName: '',
    date: '',
    venue: '',
    description: '',
    maxCapacity: ''
  });
  
  // Student filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEvent, setFilterEvent] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.universityRollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEvent = !filterEvent || student.eventId === filterEvent;
      
      return matchesSearch && matchesEvent;
    });
  }, [students, searchQuery, filterEvent]);

  // Stats
  const stats = useMemo(() => ({
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
    totalStudents: students.length,
    todayRegistrations: students.filter(s => {
      const today = new Date().toDateString();
      return new Date(s.registeredAt).toDateString() === today;
    }).length
  }), [events, students]);

  // Event handlers
  const handleOpenEventModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        eventName: event.eventName,
        date: event.date,
        venue: event.venue,
        description: event.description || '',
        maxCapacity: event.maxCapacity?.toString() || ''
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        eventName: '',
        date: '',
        venue: '',
        description: '',
        maxCapacity: ''
      });
    }
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.eventName || !eventForm.date || !eventForm.venue) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    const eventData = {
      eventName: eventForm.eventName,
      date: eventForm.date,
      venue: eventForm.venue,
      description: eventForm.description,
      maxCapacity: eventForm.maxCapacity ? parseInt(eventForm.maxCapacity) : undefined
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      addToast('success', '✅ Event updated successfully');
    } else {
      addEvent(eventData);
      addToast('success', '🎉 Event created successfully');
    }

    setShowEventModal(false);
  };

  const handleConfirmDelete = () => {
    if (!showDeleteConfirm) return;

    if (showDeleteConfirm.type === 'event') {
      deleteEvent(showDeleteConfirm.id);
      addToast('success', 'Event deleted successfully');
    } else {
      deleteStudent(showDeleteConfirm.id);
      addToast('success', 'Student registration removed');
    }

    setShowDeleteConfirm(null);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Contact', 'College', 'Age', 'Gender', 'Roll Number', 'Batch', 'Event', 'Registered At'];
    const rows = filteredStudents.map(s => {
      const event = events.find(e => e.id === s.eventId);
      return [
        s.fullName,
        s.email,
        s.contactNumber,
        s.collegeName,
        s.age,
        s.gender,
        s.universityRollNumber,
        s.batch,
        event?.eventName || 'Unknown',
        new Date(s.registeredAt).toLocaleDateString()
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    addToast('success', '📥 CSV exported successfully');
  };

  const getEventName = (eventId: string) => {
    return events.find(e => e.id === eventId)?.eventName || 'Unknown Event';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen pt-16 transition-colors duration-300',
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    )}>
      {/* Header */}
      <div className={cn(
        'border-b transition-colors',
        isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className={cn(
                'text-2xl font-bold transition-colors',
                isDark ? 'text-white' : 'text-slate-900'
              )}>
                Admin Dashboard
              </h1>
              <p className={cn(
                'mt-1 transition-colors',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}>
                Manage events and student registrations
              </p>
            </div>
            <Button onClick={() => handleOpenEventModal()} className="animate-fade-in">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Events', value: stats.totalEvents, icon: '📅', gradient: 'from-violet-500 to-purple-500' },
            { label: 'Upcoming Events', value: stats.upcomingEvents, icon: '🎯', gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Total Students', value: stats.totalStudents, icon: '👥', gradient: 'from-blue-500 to-cyan-500' },
            { label: "Today's Registrations", value: stats.todayRegistrations, icon: '📝', gradient: 'from-amber-500 to-orange-500' },
          ].map((stat, i) => (
            <div
              key={i}
              className={cn(
                'relative rounded-2xl p-5 border transition-all duration-300',
                'hover:scale-[1.02] cursor-default animate-fade-in-up group',
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50'
                  : 'bg-white border-slate-100 hover:border-violet-200 shadow-sm hover:shadow-lg'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={cn(
                'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                `bg-gradient-to-br ${stat.gradient}`
              )} />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    'text-sm transition-colors',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  )}>
                    {stat.label}
                  </p>
                  <p className={cn(
                    'text-3xl font-bold mt-1 transition-colors',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  isDark ? 'bg-slate-700/50' : 'bg-slate-100'
                )}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={cn(
          'rounded-2xl border overflow-hidden transition-colors',
          isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white border-slate-100 shadow-sm'
        )}>
          <div className={cn(
            'border-b transition-colors',
            isDark ? 'border-slate-700' : 'border-slate-100'
          )}>
            <div className="flex gap-1 p-1.5">
              {([
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'events', label: 'Events', icon: '🎉' },
                { id: 'students', label: 'Students', icon: '🎓' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'bg-violet-100 text-violet-700'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Recent Events */}
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-4 transition-colors',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}>
                    Recent Events
                  </h3>
                  {events.length === 0 ? (
                    <EmptyState
                      title="No events yet"
                      description="Create your first event to get started"
                      actionLabel="Add Event"
                      onAction={() => handleOpenEventModal()}
                    />
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.slice(0, 3).map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          showActions
                          onEdit={() => handleOpenEventModal(event)}
                          onDelete={() => setShowDeleteConfirm({ type: 'event', id: event.id })}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Registrations */}
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-4 transition-colors',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}>
                    Recent Registrations
                  </h3>
                  {students.length === 0 ? (
                    <EmptyState
                      title="No registrations yet"
                      description="Students will appear here once they register for events"
                    />
                  ) : (
                    <div className={cn(
                      'overflow-x-auto rounded-xl border transition-colors',
                      isDark ? 'border-slate-700' : 'border-slate-200'
                    )}>
                      <table className="w-full">
                        <thead>
                          <tr className={cn(
                            'border-b transition-colors',
                            isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
                          )}>
                            <th className={cn(
                              'text-left py-3 px-4 text-sm font-medium transition-colors',
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            )}>Student</th>
                            <th className={cn(
                              'text-left py-3 px-4 text-sm font-medium transition-colors',
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            )}>Event</th>
                            <th className={cn(
                              'text-left py-3 px-4 text-sm font-medium transition-colors',
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            )}>College</th>
                            <th className={cn(
                              'text-left py-3 px-4 text-sm font-medium transition-colors',
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            )}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.slice(-5).reverse().map((student) => (
                            <tr 
                              key={student.id} 
                              className={cn(
                                'border-b transition-colors',
                                isDark 
                                  ? 'border-slate-700/50 hover:bg-slate-700/30' 
                                  : 'border-slate-50 hover:bg-slate-50'
                              )}
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className={cn(
                                    'font-medium transition-colors',
                                    isDark ? 'text-white' : 'text-slate-900'
                                  )}>{student.fullName}</p>
                                  <p className={cn(
                                    'text-sm transition-colors',
                                    isDark ? 'text-slate-500' : 'text-slate-500'
                                  )}>{student.email}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={cn(
                                  'px-2.5 py-1 rounded-lg text-sm font-medium transition-colors',
                                  isDark
                                    ? 'bg-violet-500/10 text-violet-400'
                                    : 'bg-violet-100 text-violet-700'
                                )}>
                                  {getEventName(student.eventId)}
                                </span>
                              </td>
                              <td className={cn(
                                'py-3 px-4 transition-colors',
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              )}>{student.collegeName}</td>
                              <td className={cn(
                                'py-3 px-4 text-sm transition-colors',
                                isDark ? 'text-slate-500' : 'text-slate-500'
                              )}>
                                {new Date(student.registeredAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Event-wise Registration Stats */}
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-4 transition-colors',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}>
                    Registration by Event
                  </h3>
                  <div className="space-y-3">
                    {events.map((event) => {
                      const count = getRegistrationCount(event.id);
                      const max = event.maxCapacity || 100;
                      const percentage = Math.min((count / max) * 100, 100);
                      
                      return (
                        <div 
                          key={event.id} 
                          className={cn(
                            'rounded-xl p-4 transition-colors',
                            isDark ? 'bg-slate-700/30' : 'bg-slate-50'
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              'font-medium transition-colors',
                              isDark ? 'text-white' : 'text-slate-900'
                            )}>
                              {event.eventName}
                            </span>
                            <span className={cn(
                              'text-sm transition-colors',
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            )}>
                              {count} / {max}
                            </span>
                          </div>
                          <div className={cn(
                            'h-2 rounded-full overflow-hidden transition-colors',
                            isDark ? 'bg-slate-600' : 'bg-slate-200'
                          )}>
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="animate-fade-in">
                {events.length === 0 ? (
                  <EmptyState
                    title="No events yet"
                    description="Create your first event to get started"
                    actionLabel="Add Event"
                    onAction={() => handleOpenEventModal()}
                  />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, i) => (
                      <div
                        key={event.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <EventCard
                          event={event}
                          showActions
                          onEdit={() => handleOpenEventModal(event)}
                          onDelete={() => setShowDeleteConfirm({ type: 'event', id: event.id })}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="animate-fade-in">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <svg className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors',
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by name, email, or roll number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                          'w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all',
                          'focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',
                          isDark
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                        )}
                      />
                    </div>
                  </div>
                  <Select
                    options={[
                      { value: '', label: 'All Events' },
                      ...events.map(e => ({ value: e.id, label: e.eventName }))
                    ]}
                    value={filterEvent}
                    onChange={(e) => setFilterEvent(e.target.value)}
                    className="w-full sm:w-48"
                  />
                  <Button variant="secondary" onClick={exportToCSV}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                  </Button>
                </div>

                {/* Students Table */}
                {filteredStudents.length === 0 ? (
                  <EmptyState
                    title="No students found"
                    description={searchQuery || filterEvent ? "Try adjusting your search or filter" : "Students will appear here once they register"}
                  />
                ) : (
                  <div className={cn(
                    'overflow-x-auto rounded-xl border transition-colors',
                    isDark ? 'border-slate-700' : 'border-slate-200'
                  )}>
                    <table className="w-full">
                      <thead className={cn(
                        'transition-colors',
                        isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                      )}>
                        <tr>
                          <th className={cn(
                            'text-left py-3 px-4 text-sm font-medium transition-colors',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}>Student</th>
                          <th className={cn(
                            'text-left py-3 px-4 text-sm font-medium transition-colors',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}>Contact</th>
                          <th className={cn(
                            'text-left py-3 px-4 text-sm font-medium transition-colors',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}>College</th>
                          <th className={cn(
                            'text-left py-3 px-4 text-sm font-medium transition-colors',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}>Event</th>
                          <th className={cn(
                            'text-left py-3 px-4 text-sm font-medium transition-colors',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}>Batch</th>
                          <th className={cn(
                            'text-left py-3 px-4 text-sm font-medium transition-colors',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className={cn(
                        'divide-y transition-colors',
                        isDark ? 'divide-slate-700/50' : 'divide-slate-100'
                      )}>
                        {filteredStudents.map((student, i) => (
                          <tr
                            key={student.id}
                            className={cn(
                              'transition-colors animate-fade-in',
                              isDark 
                                ? 'hover:bg-slate-700/30' 
                                : 'hover:bg-slate-50'
                            )}
                            style={{ animationDelay: `${i * 30}ms` }}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-violet-500/25">
                                  {student.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className={cn(
                                    'font-medium transition-colors',
                                    isDark ? 'text-white' : 'text-slate-900'
                                  )}>{student.fullName}</p>
                                  <p className={cn(
                                    'text-sm transition-colors',
                                    isDark ? 'text-slate-500' : 'text-slate-500'
                                  )}>{student.universityRollNumber}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className={cn(
                                'transition-colors',
                                isDark ? 'text-slate-300' : 'text-slate-900'
                              )}>{student.email}</p>
                              <p className={cn(
                                'text-sm transition-colors',
                                isDark ? 'text-slate-500' : 'text-slate-500'
                              )}>{student.contactNumber}</p>
                            </td>
                            <td className={cn(
                              'py-4 px-4 transition-colors',
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            )}>{student.collegeName}</td>
                            <td className="py-4 px-4">
                              <span className={cn(
                                'px-2.5 py-1 rounded-lg text-sm font-medium transition-colors',
                                isDark
                                  ? 'bg-violet-500/10 text-violet-400'
                                  : 'bg-violet-100 text-violet-700'
                              )}>
                                {getEventName(student.eventId)}
                              </span>
                            </td>
                            <td className={cn(
                              'py-4 px-4 transition-colors',
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            )}>{student.batch}</td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => setShowDeleteConfirm({ type: 'student', id: student.id })}
                                className={cn(
                                  'p-2 rounded-lg transition-all duration-200 hover:scale-105',
                                  isDark
                                    ? 'text-red-400 hover:bg-red-500/10'
                                    : 'text-red-500 hover:bg-red-50'
                                )}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Results count */}
                <div className={cn(
                  'mt-4 text-sm transition-colors',
                  isDark ? 'text-slate-500' : 'text-slate-500'
                )}>
                  Showing {filteredStudents.length} of {students.length} students
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
        size="lg"
      >
        <div className="space-y-5">
          <Input
            label="Event Name"
            placeholder="Enter event name"
            value={eventForm.eventName}
            onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              required
            />
            <Input
              label="Max Capacity"
              type="number"
              placeholder="Optional"
              value={eventForm.maxCapacity}
              onChange={(e) => setEventForm({ ...eventForm, maxCapacity: e.target.value })}
            />
          </div>

          <Input
            label="Venue"
            placeholder="Enter venue"
            value={eventForm.venue}
            onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
            required
          />

          <div className="space-y-1.5">
            <label className={cn(
              'block text-sm font-medium transition-colors',
              isDark ? 'text-slate-300' : 'text-slate-700'
            )}>Description</label>
            <textarea
              placeholder="Event description (optional)"
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              rows={3}
              className={cn(
                'w-full px-4 py-2.5 rounded-xl border transition-all resize-none',
                'focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
              )}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEventModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveEvent} className="flex-1">
              {editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="text-center">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
            isDark ? 'bg-red-500/10' : 'bg-red-100'
          )}>
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className={cn(
            'text-lg font-semibold mb-2 transition-colors',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
            Are you sure?
          </h3>
          <p className={cn(
            'mb-6 transition-colors',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}>
            {showDeleteConfirm?.type === 'event'
              ? 'This will permanently delete the event and all related registrations.'
              : 'This will permanently remove this student registration.'}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
