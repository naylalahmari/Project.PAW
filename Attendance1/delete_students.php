<?php
require 'db_connect.php';
$db = getConnection();

if (!$db) die("Database connection failed!");

$id = $_GET['id'] ?? null;

if ($id) {
    $sql = "DELETE FROM students WHERE id = ?";
    $stmt = $db->prepare($sql);

    try {
        $stmt->execute([$id]);
        echo "Student deleted.";
    } catch (PDOException $e) {
        echo "Error deleting student: " . $e->getMessage();
    }
}

echo "<br><a href='list_students.php'>Back to list</a>";
