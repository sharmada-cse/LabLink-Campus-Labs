import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Booking, Notification } from '../types';
import { users, bookings as initialBookings, notifications as initialNotifications } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [bookingsList, setBookingsList] = useState<Booking[]>(initialBookings);
  const [notificationsList, setNotificationsList] = useState<Notification[]>(initialNotifications);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check persisted login
  useEffect(() => {
    const savedUser = localStorage.getItem('lablink_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const found = users.find(u => u.id === parsed.id);
        if (found) {
          setCurrentUser(found);
          setIsAuthenticated(true);
        }
      } catch {
        // ignore
      }
    }

    // Load persisted bookings
    const savedBookings = localStorage.getItem('lablink_bookings');
    if (savedBookings) {
      try {
        setBookingsList(JSON.parse(savedBookings));
      } catch {
        // ignore
      }
    }
  }, []);

  const login = (email: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      localStorage.setItem('lablink_user', JSON.stringify({ id: found.id }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lablink_user');
    setCurrentUser(users[0]);
  };

  const addBooking = (booking: Booking) => {
    const updated = [...bookingsList, booking];
    setBookingsList(updated);
    localStorage.setItem('lablink_bookings', JSON.stringify(updated));
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const updated = bookingsList.map(b =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
    );
    setBookingsList(updated);
    localStorage.setItem('lablink_bookings', JSON.stringify(updated));
  };

  const cancelBooking = (id: string) => {
    updateBooking(id, { status: 'cancelled' });
  };

  const markNotificationRead = (id: string) => {
    setNotificationsList(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notificationsList.filter(n =>
    n.userId === currentUser.id && !n.read
  ).length;

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      allUsers: users,
      bookings: bookingsList,
      addBooking,
      updateBooking,
      cancelBooking,
      notifications: notificationsList.filter(n => n.userId === currentUser.id),
      markNotificationRead,
      unreadCount,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
