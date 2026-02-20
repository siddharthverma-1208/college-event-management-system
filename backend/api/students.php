<?php
/**
 * =====================================================
 * Students API
 * =====================================================
 * Handles student registration and management
 * 
 * Endpoints:
 * GET    /students.php              - Get all students
 * GET    /students.php?id=1         - Get single student
 * GET    /students.php?event_id=1   - Get students by event
 * GET    /students.php?search=name  - Search students
 * POST   /students.php              - Register student
 * DELETE /students.php?id=1         - Delete registration
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

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get parameters
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$eventId = isset($_GET['event_id']) ? (int)$_GET['event_id'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                getStudent($db, $id);
            } else {
                getAllStudents($db, $eventId, $search);
            }
            break;
            
        case 'POST':
            registerStudent($db);
            break;
            
        case 'DELETE':
            // Requires admin auth
            checkAdminAuth();
            if (!$id) {
                jsonResponse(['error' => 'Student ID is required'], 400);
            }
            deleteStudent($db, $id);
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    error_log("Students API Error: " . $e->getMessage());
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
 * Get all students with optional filtering
 */
function getAllStudents($db, $eventId = null, $search = null) {
    $sql = "
        SELECT 
            u.id,
            u.full_name,
            u.email,
            u.contact_number,
            u.college_name,
            u.age,
            u.gender,
            u.university_roll_number,
            u.batch,
            u.event_id,
            u.registered_at,
            e.event_name,
            e.date as event_date,
            e.venue
        FROM users u
        JOIN events e ON u.event_id = e.id
        WHERE 1=1
    ";
    
    $params = [];
    
    // Filter by event
    if ($eventId) {
        $sql .= " AND u.event_id = ?";
        $params[] = $eventId;
    }
    
    // Search by name, email, or roll number
    if ($search) {
        $searchTerm = '%' . sanitize($search) . '%';
        $sql .= " AND (u.full_name LIKE ? OR u.email LIKE ? OR u.university_roll_number LIKE ?)";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $sql .= " ORDER BY u.registered_at DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $students = $stmt->fetchAll();
    
    // Format response
    $formattedStudents = array_map(function($student) {
        return [
            'id' => (string)$student['id'],
            'fullName' => $student['full_name'],
            'email' => $student['email'],
            'contactNumber' => $student['contact_number'],
            'collegeName' => $student['college_name'],
            'age' => (int)$student['age'],
            'gender' => $student['gender'],
            'universityRollNumber' => $student['university_roll_number'],
            'batch' => $student['batch'],
            'eventId' => (string)$student['event_id'],
            'eventName' => $student['event_name'],
            'eventDate' => $student['event_date'],
            'venue' => $student['venue'],
            'registeredAt' => $student['registered_at']
        ];
    }, $students);
    
    jsonResponse([
        'success' => true,
        'data' => $formattedStudents,
        'count' => count($formattedStudents)
    ]);
}

/**
 * Get single student by ID
 */
function getStudent($db, $id) {
    $sql = "
        SELECT 
            u.*,
            e.event_name,
            e.date as event_date,
            e.venue
        FROM users u
        JOIN events e ON u.event_id = e.id
        WHERE u.id = ?
    ";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([$id]);
    $student = $stmt->fetch();
    
    if (!$student) {
        jsonResponse(['error' => 'Student not found'], 404);
    }
    
    jsonResponse([
        'success' => true,
        'data' => [
            'id' => (string)$student['id'],
            'fullName' => $student['full_name'],
            'email' => $student['email'],
            'contactNumber' => $student['contact_number'],
            'collegeName' => $student['college_name'],
            'age' => (int)$student['age'],
            'gender' => $student['gender'],
            'universityRollNumber' => $student['university_roll_number'],
            'batch' => $student['batch'],
            'eventId' => (string)$student['event_id'],
            'eventName' => $student['event_name'],
            'eventDate' => $student['event_date'],
            'venue' => $student['venue'],
            'registeredAt' => $student['registered_at']
        ]
    ]);
}

/**
 * Register a new student for an event
 */
function registerStudent($db) {
    $data = getJsonInput();
    
    // Validate required fields
    $required = [
        'fullName', 'email', 'contactNumber', 'collegeName',
        'age', 'gender', 'universityRollNumber', 'batch', 'eventId'
    ];
    
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse([
            'error' => 'Missing required fields: ' . implode(', ', $missing)
        ], 400);
    }
    
    // Sanitize and validate data
    $fullName = sanitize($data['fullName']);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $contactNumber = sanitize($data['contactNumber']);
    $collegeName = sanitize($data['collegeName']);
    $age = (int)$data['age'];
    $gender = sanitize($data['gender']);
    $rollNumber = sanitize($data['universityRollNumber']);
    $batch = sanitize($data['batch']);
    $eventId = (int)$data['eventId'];
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email format'], 400);
    }
    
    // Validate age
    if ($age < 16 || $age > 30) {
        jsonResponse(['error' => 'Age must be between 16 and 30'], 400);
    }
    
    // Validate gender
    if (!in_array($gender, ['male', 'female', 'other'])) {
        jsonResponse(['error' => 'Invalid gender value'], 400);
    }
    
    // Check if event exists and get capacity
    $eventSql = "
        SELECT e.id, e.event_name, e.max_capacity, COUNT(u.id) as current_count
        FROM events e
        LEFT JOIN users u ON e.id = u.event_id
        WHERE e.id = ?
        GROUP BY e.id
    ";
    $eventStmt = $db->prepare($eventSql);
    $eventStmt->execute([$eventId]);
    $event = $eventStmt->fetch();
    
    if (!$event) {
        jsonResponse(['error' => 'Event not found'], 404);
    }
    
    // Check capacity
    if ($event['current_count'] >= $event['max_capacity']) {
        jsonResponse(['error' => 'Event registration is full'], 400);
    }
    
    // Check for duplicate registration
    $dupSql = "
        SELECT id FROM users 
        WHERE event_id = ? AND (email = ? OR university_roll_number = ?)
    ";
    $dupStmt = $db->prepare($dupSql);
    $dupStmt->execute([$eventId, $email, $rollNumber]);
    
    if ($dupStmt->fetch()) {
        jsonResponse([
            'error' => 'You have already registered for this event with the same email or roll number'
        ], 409);
    }
    
    // Insert registration
    $sql = "
        INSERT INTO users 
        (full_name, email, contact_number, college_name, age, gender, university_roll_number, batch, event_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $fullName, $email, $contactNumber, $collegeName,
        $age, $gender, $rollNumber, $batch, $eventId
    ]);
    
    $newId = $db->lastInsertId();
    
    jsonResponse([
        'success' => true,
        'message' => 'Registration successful! Welcome to ' . $event['event_name'],
        'data' => [
            'id' => (string)$newId,
            'fullName' => $fullName,
            'email' => $email,
            'eventName' => $event['event_name']
        ]
    ], 201);
}

/**
 * Delete student registration
 */
function deleteStudent($db, $id) {
    // Check if student exists
    $checkSql = "SELECT id, full_name FROM users WHERE id = ?";
    $checkStmt = $db->prepare($checkSql);
    $checkStmt->execute([$id]);
    $student = $checkStmt->fetch();
    
    if (!$student) {
        jsonResponse(['error' => 'Student not found'], 404);
    }
    
    // Delete registration
    $sql = "DELETE FROM users WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$id]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Registration deleted successfully'
    ]);
}
?>
