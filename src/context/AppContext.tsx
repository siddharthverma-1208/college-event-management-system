import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, Student, ToastMessage } from '../types';

// Initial sample events with future dates
const getUpcomingDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

const initialEvents: Event[] = [
  {
    id: '1',
    eventName: 'Tech Fest 2024',
    date: getUpcomingDate(7),
    venue: 'Main Auditorium',
    description: 'Annual technology festival with coding competitions, robotics showcase, and tech workshops by industry experts.',
    maxCapacity: 500
  },
  {
    id: '2',
    eventName: 'Cultural Night',
    date: getUpcomingDate(14),
    venue: 'Open Air Theater',
    description: 'A magical night celebrating diversity through music, dance, drama, and cultural performances from around the world.',
    maxCapacity: 1000
  },
  {
    id: '3',
    eventName: 'Sports Meet 2024',
    date: getUpcomingDate(21),
    venue: 'College Ground',
    description: 'Inter-college sports competition featuring athletics, team sports, and individual events with exciting prizes.',
    maxCapacity: 300
  },
  {
    id: '4',
    eventName: 'Hackathon',
    date: getUpcomingDate(30),
    venue: 'Computer Lab Complex',
    description: '24-hour coding marathon to build innovative solutions. Team up and create something amazing!',
    maxCapacity: 200
  },
  {
    id: '5',
    eventName: 'Career Fair 2024',
    date: getUpcomingDate(45),
    venue: 'Exhibition Hall',
    description: 'Connect with top companies, explore career opportunities, and attend resume building workshops.',
    maxCapacity: 800
  },
  {
    id: '6',
    eventName: 'Music Festival',
    date: getUpcomingDate(60),
    venue: 'College Amphitheater',
    description: 'A day of live performances featuring student bands, solo artists, and guest musicians.',
    maxCapacity: 1500
  }
];

// Sample students for demo
const sampleStudents: Student[] = [
  {
    id: 's1',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    contactNumber: '9876543210',
    collegeName: 'Delhi University',
    age: 21,
    gender: 'male',
    universityRollNumber: 'DU2021001',
    batch: '2021-2025',
    eventId: '1',
    registeredAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 's2',
    fullName: 'Priya Patel',
    email: 'priya.patel@email.com',
    contactNumber: '9876543211',
    collegeName: 'Mumbai University',
    age: 20,
    gender: 'female',
    universityRollNumber: 'MU2022001',
    batch: '2022-2026',
    eventId: '1',
    registeredAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 's3',
    fullName: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    contactNumber: '9876543212',
    collegeName: 'IIT Delhi',
    age: 22,
    gender: 'male',
    universityRollNumber: 'IIT2021002',
    batch: '2021-2025',
    eventId: '2',
    registeredAt: new Date().toISOString()
  }
];

type Theme = 'light' | 'dark';

interface AppContextType {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Auth
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
  
  // Events
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
  
  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'registeredAt'>) => boolean;
  deleteStudent: (id: string) => void;
  getStudentsByEvent: (eventId: string) => Student[];
  getRegistrationCount: (eventId: string) => number;
  
  // Toast
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
  
  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Initialize state from localStorage or defaults
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : initialEvents;
  });
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : sampleStudents;
    }
    return sampleStudents;
  });
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
  });
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Admin functions
  const adminLogin = (username: string, password: string): boolean => {
    // Simple auth (in production, use proper hashing)
    if (username === 'admin' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('adminLoggedIn');
  };

  // Event functions
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    // Also delete related student registrations
    setStudents(prev => prev.filter(student => student.eventId !== id));
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  // Student functions
  const addStudent = (studentData: Omit<Student, 'id' | 'registeredAt'>): boolean => {
    // Check for duplicate email or roll number for same event
    const duplicate = students.find(
      s => s.eventId === studentData.eventId && 
           (s.email === studentData.email || s.universityRollNumber === studentData.universityRollNumber)
    );
    
    if (duplicate) {
      return false;
    }

    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString()
    };
    setStudents(prev => [...prev, newStudent]);
    return true;
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const getStudentsByEvent = (eventId: string) => {
    return students.filter(student => student.eventId === eventId);
  };

  const getRegistrationCount = (eventId: string) => {
    return students.filter(student => student.eventId === eventId).length;
  };

  // Toast functions
  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      isAdminLoggedIn,
      adminLogin,
      adminLogout,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
      students,
      addStudent,
      deleteStudent,
      getStudentsByEvent,
      getRegistrationCount,
      toasts,
      addToast,
      removeToast,
      isLoading,
      setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
