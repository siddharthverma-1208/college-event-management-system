<?php
/**
 * =====================================================
 * CSV Export API
 * =====================================================
 * Exports student registrations to CSV file
 * 
 * Endpoints:
 * GET /export.php                - Export all students
 * GET /export.php?event_id=1     - Export students by event
 * =====================================================
 */

require_once '../config/database.php';

// Handle CORS
handleCors();

// Check admin authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(['error' => 'Unauthorized. Admin login required.'], 401);
}

// Get database connection
$db = getConnection();

if (!$db) {
    jsonResponse(['error' => 'Database connection failed'], 500);
}

// Get event filter if provided
$eventId = isset($_GET['event_id']) ? (int)$_GET['event_id'] : null;

try {
    exportToCSV($db, $eventId);
} catch (Exception $e) {
    error_log("Export API Error: " . $e->getMessage());
    jsonResponse(['error' => 'Server error occurred'], 500);
}

/**
 * Export students to CSV
 */
function exportToCSV($db, $eventId = null) {
    // Build query
    $sql = "
        SELECT 
            u.full_name as 'Full Name',
            u.email as 'Email',
            u.contact_number as 'Contact Number',
            u.college_name as 'College Name',
            u.age as 'Age',
            u.gender as 'Gender',
            u.university_roll_number as 'University Roll Number',
            u.batch as 'Batch',
            e.event_name as 'Event',
            e.date as 'Event Date',
            e.venue as 'Venue',
            u.registered_at as 'Registered At'
        FROM users u
        JOIN events e ON u.event_id = e.id
    ";
    
    $params = [];
    
    if ($eventId) {
        $sql .= " WHERE u.event_id = ?";
        $params[] = $eventId;
    }
    
    $sql .= " ORDER BY u.registered_at DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $students = $stmt->fetchAll();
    
    if (empty($students)) {
        jsonResponse(['error' => 'No data to export'], 404);
    }
    
    // Generate filename
    $filename = 'student_registrations';
    if ($eventId) {
        // Get event name
        $eventSql = "SELECT event_name FROM events WHERE id = ?";
        $eventStmt = $db->prepare($eventSql);
        $eventStmt->execute([$eventId]);
        $event = $eventStmt->fetch();
        if ($event) {
            $filename .= '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $event['event_name']);
        }
    }
    $filename .= '_' . date('Y-m-d_H-i-s') . '.csv';
    
    // Set headers for CSV download
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Pragma: no-cache');
    header('Expires: 0');
    
    // Open output stream
    $output = fopen('php://output', 'w');
    
    // Add BOM for Excel UTF-8 compatibility
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Write headers
    if (!empty($students)) {
        fputcsv($output, array_keys($students[0]));
    }
    
    // Write data rows
    foreach ($students as $row) {
        fputcsv($output, $row);
    }
    
    fclose($output);
    exit;
}
?>
