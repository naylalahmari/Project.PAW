<?php
require 'db_connect.php';
$db = getConnection();

if (!$db) die("Database connection failed!");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $session_id = $_POST['session_id'] ?? null;

    if (!$session_id) {
        $message = "Session ID is required!";
    } else {
        try {
            $sql = "UPDATE attendance_sessions SET status = 'closed' WHERE id = ? AND status = 'open'";
            $stmt = $db->prepare($sql);
            $stmt->execute([$session_id]);

            if ($stmt->rowCount() > 0) {
                $message = "Session $session_id has been successfully closed.";
            } else {
                $message = "Session ID $session_id not found or already closed.";
            }
        } catch (PDOException $e) {
            $message = "Error closing session: " . $e->getMessage();
        }
    }
}
?>

<h2>Close Session</h2>

<?php if (!empty($message)) echo "<p>$message</p>"; ?>

<form method="POST" action="">
    <label>Session ID:</label><br>
    <input type="number" name="session_id" required><br><br>
    <button type="submit">Close Session</button>
</form>
