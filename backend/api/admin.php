<?php
/**
 * =====================================================
 * Admin Authentication API
 * =====================================================
 * Handles admin login, logout, and session management
 * 
 * Endpoints:
 * POST /admin.php?action=login   - Admin login
 * POST /admin.php?action=logout  - Admin logout
 * GET  /admin.php?action=check   - Check login status
 * GET  /admin.php?action=stats   - Get dashboard stats
 * =====================================================
 */

require_once '../config/database.php';

// Handle CORS
handleCors();

// Get database connection
$db = getConnection();

if (!$db) {
    jsonResponse(['error' => 'Database connection failed'], 500);
}

// Get action
$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'login':
            if ($method !== 'POST') {
                jsonResponse(['error' => 'Method not allowed'], 405);
            }
            adminLogin($db);
            break;
            
        case 'logout':
            adminLogout();
            break;
            
        case 'check':
            checkLoginStatus();
            break;
            
        case 'stats':
            checkAdminAuth();
            getDashboardStats($db);
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
} catch (Exception $e) {
    error_log("Admin API Error: " . $e->getMessage());
    jsonResponse(['error' => 'Server error occurred'], 500);
}

/**
 * Check if admin is authenticated
 */
function checkAdminAuth() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        jsonResponse(['error' => 'Unauthorized. Admin login required.'], 401);
    }
}

/**
 * Admin login
 */
function adminLogin($db) {
    $data = getJsonInput();
    
    // Validate input
    if (empty($data['username']) || empty($data['password'])) {
        jsonResponse(['error' => 'Username and password are required'], 400);
    }
    
    $username = sanitize($data['username']);
    $password = $data['password']; // Don't sanitize password before verification
    
    // Get admin from database
    $sql = "SELECT id, username, password FROM admin WHERE username = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        // Log failed attempt
        error_log("Failed login attempt for username: " . $username);
        jsonResponse(['error' => 'Invalid username or password'], 401);
    }
    
    // Verify password
    if (!password_verify($password, $admin['password'])) {
        error_log("Failed login attempt for username: " . $username);
        jsonResponse(['error' => 'Invalid username or password'], 401);
    }
    
    // Update last login
    $updateSql = "UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE id = ?";
    $updateStmt = $db->prepare($updateSql);
    $updateStmt->execute([$admin['id']]);
    
    // Set session
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_username'] = $admin['username'];
    
    jsonResponse([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'username' => $admin['username']
        ]
    ]);
}

/**
 * Admin logout
 */
function adminLogout() {
    // Clear session
    $_SESSION = [];
    
    // Destroy session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destroy session
    session_destroy();
    
    jsonResponse([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
}

/**
 * Check login status
 */
function checkLoginStatus() {
    $isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
    
    jsonResponse([
        'success' => true,
        'isLoggedIn' => $isLoggedIn,
        'username' => $isLoggedIn ? $_SESSION['admin_username'] : null
    ]);
}

/**
 * Get dashboard statistics
 */
function getDashboardStats($db) {
    // Total events
    $eventsSql = "SELECT COUNT(*) as total FROM events";
    $eventsStmt = $db->query($eventsSql);
    $totalEvents = $eventsStmt->fetch()['total'];
    
    // Upcoming events
    $upcomingSql = "SELECT COUNT(*) as total FROM events WHERE date >= CURDATE()";
    $upcomingStmt = $db->query($upcomingSql);
    $upcomingEvents = $upcomingStmt->fetch()['total'];
    
    // Total students
    $studentsSql = "SELECT COUNT(*) as total FROM users";
    $studentsStmt = $db->query($studentsSql);
    $totalStudents = $studentsStmt->fetch()['total'];
    
    // Today's registrations
    $todaySql = "SELECT COUNT(*) as total FROM users WHERE DATE(registered_at) = CURDATE()";
    $todayStmt = $db->query($todaySql);
    $todayRegistrations = $todayStmt->fetch()['total'];
    
    // Registration by event
    $eventStatsSql = "
        SELECT 
            e.id,
            e.event_name,
            e.max_capacity,
            COUNT(u.id) as registration_count
        FROM events e
        LEFT JOIN users u ON e.id = u.event_id
        GROUP BY e.id
        ORDER BY registration_count DESC
    ";
    $eventStatsStmt = $db->query($eventStatsSql);
    $eventStats = $eventStatsStmt->fetchAll();
    
    // Recent registrations
    $recentSql = "
        SELECT 
            u.id,
            u.full_name,
            u.email,
            u.college_name,
            u.registered_at,
            e.event_name
        FROM users u
        JOIN events e ON u.event_id = e.id
        ORDER BY u.registered_at DESC
        LIMIT 5
    ";
    $recentStmt = $db->query($recentSql);
    $recentRegistrations = $recentStmt->fetchAll();
    
    jsonResponse([
        'success' => true,
        'data' => [
            'totalEvents' => (int)$totalEvents,
            'upcomingEvents' => (int)$upcomingEvents,
            'totalStudents' => (int)$totalStudents,
            'todayRegistrations' => (int)$todayRegistrations,
            'eventStats' => array_map(function($e) {
                return [
                    'id' => (string)$e['id'],
                    'eventName' => $e['event_name'],
                    'maxCapacity' => (int)$e['max_capacity'],
                    'registrationCount' => (int)$e['registration_count']
                ];
            }, $eventStats),
            'recentRegistrations' => array_map(function($r) {
                return [
                    'id' => (string)$r['id'],
                    'fullName' => $r['full_name'],
                    'email' => $r['email'],
                    'collegeName' => $r['college_name'],
                    'eventName' => $r['event_name'],
                    'registeredAt' => $r['registered_at']
                ];
            }, $recentRegistrations)
        ]
    ]);
}
?>
