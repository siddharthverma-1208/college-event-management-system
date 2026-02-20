<?php
/**
 * =====================================================
 * Events API
 * =====================================================
 * Handles CRUD operations for events
 * 
 * Endpoints:
 * GET    /events.php         - Get all events
 * GET    /events.php?id=1    - Get single event
 * POST   /events.php         - Create new event
 * PUT    /events.php?id=1    - Update event
 * DELETE /events.php?id=1    - Delete event
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

// Get event ID if provided
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                // Get single event with registration count
                getEvent($db, $id);
            } else {
                // Get all events with registration counts
                getAllEvents($db);
            }
            break;
            
        case 'POST':
            // Create new event (requires admin auth)
            checkAdminAuth();
            createEvent($db);
            break;
            
        case 'PUT':
            // Update event (requires admin auth)
            checkAdminAuth();
            if (!$id) {
                jsonResponse(['error' => 'Event ID is required'], 400);
            }
            updateEvent($db, $id);
            break;
            
        case 'DELETE':
            // Delete event (requires admin auth)
            checkAdminAuth();
            if (!$id) {
                jsonResponse(['error' => 'Event ID is required'], 400);
            }
            deleteEvent($db, $id);
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    error_log("Events API Error: " . $e->getMessage());
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
 * Get all events with registration counts
 */
function getAllEvents($db) {
    $sql = "
        SELECT 
            e.id,
            e.event_name,
            e.date,
            e.venue,
            e.description,
            e.max_capacity,
            e.created_at,
            COUNT(u.id) as registration_count
        FROM events e
        LEFT JOIN users u ON e.id = u.event_id
        GROUP BY e.id
        ORDER BY e.date ASC
    ";
    
    $stmt = $db->query($sql);
    $events = $stmt->fetchAll();
    
    // Format response
    $formattedEvents = array_map(function($event) {
        return [
            'id' => (string)$event['id'],
            'eventName' => $event['event_name'],
            'date' => $event['date'],
            'venue' => $event['venue'],
            'description' => $event['description'],
            'maxCapacity' => (int)$event['max_capacity'],
            'registrationCount' => (int)$event['registration_count'],
            'createdAt' => $event['created_at']
        ];
    }, $events);
    
    jsonResponse([
        'success' => true,
        'data' => $formattedEvents,
        'count' => count($formattedEvents)
    ]);
}

/**
 * Get single event by ID
 */
function getEvent($db, $id) {
    $sql = "
        SELECT 
            e.id,
            e.event_name,
            e.date,
            e.venue,
            e.description,
            e.max_capacity,
            e.created_at,
            COUNT(u.id) as registration_count
        FROM events e
        LEFT JOIN users u ON e.id = u.event_id
        WHERE e.id = ?
        GROUP BY e.id
    ";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([$id]);
    $event = $stmt->fetch();
    
    if (!$event) {
        jsonResponse(['error' => 'Event not found'], 404);
    }
    
    jsonResponse([
        'success' => true,
        'data' => [
            'id' => (string)$event['id'],
            'eventName' => $event['event_name'],
            'date' => $event['date'],
            'venue' => $event['venue'],
            'description' => $event['description'],
            'maxCapacity' => (int)$event['max_capacity'],
            'registrationCount' => (int)$event['registration_count'],
            'createdAt' => $event['created_at']
        ]
    ]);
}

/**
 * Create new event
 */
function createEvent($db) {
    $data = getJsonInput();
    
    // Validate required fields
    $required = ['eventName', 'date', 'venue'];
    $missing = validateRequired($data, $required);
    
    if (!empty($missing)) {
        jsonResponse([
            'error' => 'Missing required fields: ' . implode(', ', $missing)
        ], 400);
    }
    
    // Prepare data
    $eventName = sanitize($data['eventName']);
    $date = sanitize($data['date']);
    $venue = sanitize($data['venue']);
    $description = isset($data['description']) ? sanitize($data['description']) : '';
    $maxCapacity = isset($data['maxCapacity']) ? (int)$data['maxCapacity'] : 100;
    
    // Validate date format
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        jsonResponse(['error' => 'Invalid date format. Use YYYY-MM-DD'], 400);
    }
    
    // Insert event
    $sql = "INSERT INTO events (event_name, date, venue, description, max_capacity) VALUES (?, ?, ?, ?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->execute([$eventName, $date, $venue, $description, $maxCapacity]);
    
    $newId = $db->lastInsertId();
    
    jsonResponse([
        'success' => true,
        'message' => 'Event created successfully',
        'data' => [
            'id' => (string)$newId,
            'eventName' => $eventName,
            'date' => $date,
            'venue' => $venue,
            'description' => $description,
            'maxCapacity' => $maxCapacity
        ]
    ], 201);
}

/**
 * Update existing event
 */
function updateEvent($db, $id) {
    // Check if event exists
    $checkSql = "SELECT id FROM events WHERE id = ?";
    $checkStmt = $db->prepare($checkSql);
    $checkStmt->execute([$id]);
    
    if (!$checkStmt->fetch()) {
        jsonResponse(['error' => 'Event not found'], 404);
    }
    
    $data = getJsonInput();
    
    // Build update query dynamically
    $updates = [];
    $params = [];
    
    if (isset($data['eventName'])) {
        $updates[] = 'event_name = ?';
        $params[] = sanitize($data['eventName']);
    }
    
    if (isset($data['date'])) {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
            jsonResponse(['error' => 'Invalid date format. Use YYYY-MM-DD'], 400);
        }
        $updates[] = 'date = ?';
        $params[] = $data['date'];
    }
    
    if (isset($data['venue'])) {
        $updates[] = 'venue = ?';
        $params[] = sanitize($data['venue']);
    }
    
    if (isset($data['description'])) {
        $updates[] = 'description = ?';
        $params[] = sanitize($data['description']);
    }
    
    if (isset($data['maxCapacity'])) {
        $updates[] = 'max_capacity = ?';
        $params[] = (int)$data['maxCapacity'];
    }
    
    if (empty($updates)) {
        jsonResponse(['error' => 'No fields to update'], 400);
    }
    
    $params[] = $id;
    $sql = "UPDATE events SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    jsonResponse([
        'success' => true,
        'message' => 'Event updated successfully'
    ]);
}

/**
 * Delete event (cascade deletes related registrations)
 */
function deleteEvent($db, $id) {
    // Check if event exists
    $checkSql = "SELECT id, event_name FROM events WHERE id = ?";
    $checkStmt = $db->prepare($checkSql);
    $checkStmt->execute([$id]);
    $event = $checkStmt->fetch();
    
    if (!$event) {
        jsonResponse(['error' => 'Event not found'], 404);
    }
    
    // Delete event (related users will be deleted due to CASCADE)
    $sql = "DELETE FROM events WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$id]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Event and all related registrations deleted successfully'
    ]);
}
?>
