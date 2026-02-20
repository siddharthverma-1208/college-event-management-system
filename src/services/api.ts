/**
 * =====================================================
 * API Service
 * =====================================================
 * Handles all API calls to the PHP backend
 * Update API_BASE_URL to match your backend location
 * =====================================================
 */

// Update this to match your backend URL
// For XAMPP: 'http://localhost/college-events/api'
// For production: 'https://yourdomain.com/api'
const API_BASE_URL = 'http://localhost/college-events/api';

// Default fetch options
const defaultOptions: RequestInit = {
  credentials: 'include', // Include cookies for session management
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
}

// =====================================================
// EVENTS API
// =====================================================

export interface EventData {
  id: string;
  eventName: string;
  date: string;
  venue: string;
  description?: string;
  maxCapacity?: number;
  registrationCount?: number;
}

export interface EventsResponse {
  success: boolean;
  data: EventData[];
  count: number;
}

export interface SingleEventResponse {
  success: boolean;
  data: EventData;
}

/**
 * Get all events
 */
export async function getEvents(): Promise<EventData[]> {
  const response = await apiRequest<EventsResponse>('/events.php');
  return response.data;
}

/**
 * Get single event by ID
 */
export async function getEventById(id: string): Promise<EventData> {
  const response = await apiRequest<SingleEventResponse>(`/events.php?id=${id}`);
  return response.data;
}

/**
 * Create new event (requires admin auth)
 */
export async function createEvent(event: Omit<EventData, 'id'>): Promise<EventData> {
  const response = await apiRequest<{ success: boolean; data: EventData }>('/events.php', {
    method: 'POST',
    body: JSON.stringify(event),
  });
  return response.data;
}

/**
 * Update event (requires admin auth)
 */
export async function updateEvent(
  id: string,
  event: Partial<EventData>
): Promise<void> {
  await apiRequest(`/events.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(event),
  });
}

/**
 * Delete event (requires admin auth)
 */
export async function deleteEvent(id: string): Promise<void> {
  await apiRequest(`/events.php?id=${id}`, {
    method: 'DELETE',
  });
}

// =====================================================
// STUDENTS API
// =====================================================

export interface StudentData {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  collegeName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  universityRollNumber: string;
  batch: string;
  eventId: string;
  eventName?: string;
  registeredAt?: string;
}

export interface StudentsResponse {
  success: boolean;
  data: StudentData[];
  count: number;
}

export interface RegistrationData {
  fullName: string;
  email: string;
  contactNumber: string;
  collegeName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  universityRollNumber: string;
  batch: string;
  eventId: string;
}

/**
 * Get all students with optional filters
 */
export async function getStudents(params?: {
  eventId?: string;
  search?: string;
}): Promise<StudentData[]> {
  let endpoint = '/students.php';
  const queryParams: string[] = [];

  if (params?.eventId) {
    queryParams.push(`event_id=${params.eventId}`);
  }
  if (params?.search) {
    queryParams.push(`search=${encodeURIComponent(params.search)}`);
  }

  if (queryParams.length > 0) {
    endpoint += '?' + queryParams.join('&');
  }

  const response = await apiRequest<StudentsResponse>(endpoint);
  return response.data;
}

/**
 * Register a student for an event
 */
export async function registerStudent(
  data: RegistrationData
): Promise<{ success: boolean; message: string }> {
  return apiRequest('/students.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Delete student registration (requires admin auth)
 */
export async function deleteStudent(id: string): Promise<void> {
  await apiRequest(`/students.php?id=${id}`, {
    method: 'DELETE',
  });
}

// =====================================================
// ADMIN API
// =====================================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    username: string;
  };
}

export interface AuthCheckResponse {
  success: boolean;
  isLoggedIn: boolean;
  username: string | null;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalStudents: number;
  todayRegistrations: number;
  eventStats: Array<{
    id: string;
    eventName: string;
    maxCapacity: number;
    registrationCount: number;
  }>;
  recentRegistrations: Array<{
    id: string;
    fullName: string;
    email: string;
    collegeName: string;
    eventName: string;
    registeredAt: string;
  }>;
}

/**
 * Admin login
 */
export async function adminLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiRequest('/admin.php?action=login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Admin logout
 */
export async function adminLogout(): Promise<{ success: boolean; message: string }> {
  return apiRequest('/admin.php?action=logout', {
    method: 'POST',
  });
}

/**
 * Check admin login status
 */
export async function checkAuthStatus(): Promise<AuthCheckResponse> {
  return apiRequest('/admin.php?action=check');
}

/**
 * Get dashboard statistics (requires admin auth)
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiRequest<{ success: boolean; data: DashboardStats }>(
    '/admin.php?action=stats'
  );
  return response.data;
}

// =====================================================
// EXPORT API
// =====================================================

/**
 * Export students to CSV (requires admin auth)
 * This returns a download URL
 */
export function getExportUrl(eventId?: string): string {
  let url = `${API_BASE_URL}/export.php`;
  if (eventId) {
    url += `?event_id=${eventId}`;
  }
  return url;
}

/**
 * Trigger CSV download (requires admin auth)
 */
export function exportToCSV(eventId?: string): void {
  const url = getExportUrl(eventId);
  window.open(url, '_blank');
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await getEvents();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get registration count for an event
 */
export async function getRegistrationCount(eventId: string): Promise<number> {
  const event = await getEventById(eventId);
  return event.registrationCount || 0;
}
