<?php
require 'db_connect.php';
$db = getConnection();

if (!$db) die("Database connection failed!");

// Test si le formulaire est soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les valeurs du formulaire
    $course_id = $_POST['course_id'] ?? null;
    $group_id = $_POST['group_id'] ?? null;
    $opened_by = $_POST['opened_by'] ?? null;

    if (!$course_id || !$group_id || !$opened_by) {
        $message = "All fields are required!";
    } else {
        try {
            $sql = "INSERT INTO attendance_sessions (course_id, group_id, opened_by) VALUES (?, ?, ?)";
            $stmt = $db->prepare($sql);
            $stmt->execute([$course_id, $group_id, $opened_by]);
            $session_id = $db->lastInsertId();
            $message = "Session created successfully! Session ID = $session_id";
        } catch (PDOException $e) {
            $message = "Error creating session: " . $e->getMessage();
        }
    }
}
?>

<h2>Create Session</h2>

<?php if (!empty($message)) echo "<p>$message</p>"; ?>

<form method="POST" action="">
    <label>Course ID:</label><br>
    <input type="number" name="course_id" required><br><br>

    <label>Group ID:</label><br>
    <input type="number" name="group_id" required><br><br>

    <label>Professor ID:</label><br>
    <input type="number" name="opened_by" required><br><br>

    <button type="submit">Create Session</button>
</form>
