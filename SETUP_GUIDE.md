# 🎓 College Event Management System - Complete Setup Guide

A full-stack web application for managing college events and student registrations with a modern React frontend and PHP + MySQL backend.

---

## 📦 Project Structure

```
college-event-system/
├── 📁 frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main pages
│   │   ├── context/        # State management
│   │   └── App.tsx         # Main app
│   ├── package.json
│   └── index.html
│
├── 📁 backend (PHP + MySQL)
│   ├── config/
│   │   └── database.php    # Database connection
│   ├── api/
│   │   ├── events.php      # Events CRUD API
│   │   ├── students.php    # Student registration API
│   │   ├── admin.php       # Admin authentication API
│   │   └── export.php      # CSV export API
│   ├── sql/
│   │   └── database.sql    # Database schema
│   └── index.php           # API documentation
│
└── SETUP_GUIDE.md          # This file
```

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18+) - [Download](https://nodejs.org/)
2. **XAMPP/WAMP/MAMP** - For Apache + MySQL
3. **Web Browser** - Chrome, Firefox, Edge, etc.

---

## 📋 Step-by-Step Setup

### Step 1: Install XAMPP

1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Install XAMPP (default location: `C:\xampp` on Windows, `/Applications/XAMPP` on Mac)
3. Start **Apache** and **MySQL** from XAMPP Control Panel

### Step 2: Setup Database

1. Open **phpMyAdmin**: http://localhost/phpmyadmin
2. Click "New" to create a database
3. Enter database name: `college_events`
4. Click "Create"
5. Select the `college_events` database
6. Click "Import" tab
7. Choose file: `backend/sql/database.sql`
8. Click "Go" to run the SQL script

**Or use MySQL command line:**
```bash
mysql -u root -p < backend/sql/database.sql
```

### Step 3: Configure Backend

1. Copy the `backend` folder to your XAMPP htdocs:
   - Windows: `C:\xampp\htdocs\college-events`
   - Mac: `/Applications/XAMPP/htdocs/college-events`

2. Update database credentials if needed in `backend/config/database.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'college_events');
   define('DB_USER', 'root');
   define('DB_PASS', '');  // Usually empty for XAMPP
   ```

3. Test the API: http://localhost/college-events/

### Step 4: Setup Frontend

1. Navigate to the project folder in terminal:
   ```bash
   cd path/to/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

---

## 🔧 Configuration

### Connecting Frontend to Backend

Update the API base URL in your React code. Create a config file:

```typescript
// src/config/api.ts
export const API_BASE_URL = 'http://localhost/college-events/api';

// Example usage
const response = await fetch(`${API_BASE_URL}/events.php`);
```

### CORS Configuration

The backend already includes CORS headers. If you face CORS issues:

1. Check that Apache is running
2. Verify the backend URL is correct
3. Clear browser cache

---

## 🔐 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

---

## 📡 API Endpoints

### Events API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events.php` | Get all events |
| GET | `/api/events.php?id=1` | Get event by ID |
| POST | `/api/events.php` | Create event (admin) |
| PUT | `/api/events.php?id=1` | Update event (admin) |
| DELETE | `/api/events.php?id=1` | Delete event (admin) |

### Students API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students.php` | Get all students |
| GET | `/api/students.php?event_id=1` | Filter by event |
| GET | `/api/students.php?search=name` | Search students |
| POST | `/api/students.php` | Register student |
| DELETE | `/api/students.php?id=1` | Delete registration (admin) |

### Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin.php?action=login` | Admin login |
| POST | `/api/admin.php?action=logout` | Admin logout |
| GET | `/api/admin.php?action=check` | Check login status |
| GET | `/api/admin.php?action=stats` | Get dashboard stats |

### Export API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export.php` | Export all students to CSV |
| GET | `/api/export.php?event_id=1` | Export by event |

---

## 📝 API Request Examples

### Register a Student

```javascript
fetch('http://localhost/college-events/api/students.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    contactNumber: '9876543210',
    collegeName: 'ABC University',
    age: 21,
    gender: 'male',
    universityRollNumber: 'ABC2021001',
    batch: '2021-2025',
    eventId: 1
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Admin Login

```javascript
fetch('http://localhost/college-events/api/admin.php?action=login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important for session cookies
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🗄️ Database Schema

### Events Table
```sql
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    max_capacity INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Users (Students) Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    university_roll_number VARCHAR(50) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

### Admin Table
```sql
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Troubleshooting

### Database Connection Error
- Verify MySQL is running in XAMPP
- Check database credentials in `database.php`
- Make sure `college_events` database exists

### CORS Error
- Ensure Apache is running
- Check backend URL is correct
- Try clearing browser cache

### 404 Not Found
- Verify backend folder is in htdocs
- Check the URL path matches folder structure

### Session Not Working
- Ensure cookies are enabled in browser
- Use `credentials: 'include'` in fetch requests

---

## 📱 Features

### Student Features
- ✅ Browse upcoming events
- ✅ Register with full details
- ✅ Form validation
- ✅ Duplicate prevention

### Admin Features
- ✅ Secure login with hashed password
- ✅ Add/Edit/Delete events
- ✅ View all registrations
- ✅ Search & filter students
- ✅ Export to CSV
- ✅ Dashboard statistics

### UI/UX Features
- ✅ Light/Dark theme toggle
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading states

---

## 🎨 Technologies Used

| Frontend | Backend | Database |
|----------|---------|----------|
| React 18 | PHP 7.4+ | MySQL 5.7+ |
| TypeScript | PDO | - |
| Vite | Sessions | - |
| Tailwind CSS | - | - |

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all services are running
3. Check browser console for errors
4. Review PHP error logs

---

## 📄 License

This project is for educational purposes.

---

**Happy Coding! 🚀**
