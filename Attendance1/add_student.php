<?php
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = $_POST['fullname'] ?? '';
    $matricule = $_POST['matricule'] ?? '';
    $group_id = $_POST['group_id'] ?? '';

    if ($fullname && $matricule && $group_id) {
        $db = getConnection();

        if ($db) {
            $sql = "INSERT INTO students (fullname, matricule, group_id) VALUES (?, ?, ?)";
            $stmt = $db->prepare($sql);

            try {
                $stmt->execute([$fullname, $matricule, $group_id]);
                echo "Student added successfully.";
            } catch (PDOException $e) {
                echo "Error adding student: " . $e->getMessage();
            }
        } else {
            echo "Database connection failed!";
        }
    } else {
        echo "Please fill all the fields.";
    }
}
?>

<form method="POST">
    <input type="text" name="fullname" placeholder="Full name"><br><br>
    <input type="text" name="matricule" placeholder="Matricule"><br><br>
    <input type="number" name="group_id" placeholder="Group ID"><br><br>
    <button type="submit">Add Student</button>
</form>
