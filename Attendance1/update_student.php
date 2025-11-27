<?php
require 'db_connect.php';
$db = getConnection();

if (!$db) die("Database connection failed!");

// Get ID
$id = $_GET['id'] ?? null;
if (!$id) die("Student ID missing!");

// Fetch current student data
$sql = "SELECT * FROM students WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->execute([$id]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) die("Student not found!");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = $_POST['fullname'];
    $matricule = $_POST['matricule'];
    $group_id = $_POST['group_id'];

    $sql = "UPDATE students SET fullname=?, matricule=?, group_id=? WHERE id=?";
    $stmt = $db->prepare($sql);

    try {
        $stmt->execute([$fullname, $matricule, $group_id, $id]);
        echo "Student updated successfully.";
        echo "<br><a href='list_students.php'>Back to list</a>";
        exit;
    } catch (PDOException $e) {
        echo "Error updating student: " . $e->getMessage();
    }
}
?>

<h2>Edit Student</h2>
<form method="POST">
    <input type="text" name="fullname" value="<?= htmlspecialchars($student['fullname']) ?>"><br><br>
    <input type="text" name="matricule" value="<?= htmlspecialchars($student['matricule']) ?>"><br><br>
    <input type="number" name="group_id" value="<?= $student['group_id'] ?>"><br><br>
    <button type="submit">Update</button>
</form>
