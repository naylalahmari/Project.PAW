<?php
require 'db_connect.php';

$db = getConnection();

if ($db) {
    $sql = "SELECT * FROM students";
    $stmt = $db->query($sql);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else {
    die("Database connection failed!");
}
?>

<h2>Students List</h2>
<table border="1" cellpadding="8">
    <tr>
        <th>ID</th>
        <th>Fullname</th>
        <th>Matricule</th>
        <th>Group ID</th>
        <th>Actions</th>
    </tr>

    <?php foreach ($students as $student): ?>
    <tr>
        <td><?= $student['id'] ?></td>
        <td><?= htmlspecialchars($student['fullname']) ?></td>
        <td><?= htmlspecialchars($student['matricule']) ?></td>
        <td><?= $student['group_id'] ?></td>
        <td>
            <a href="update_student.php?id=<?= $student['id'] ?>">Edit</a> |
            <a href="delete_students.php?id=<?= $student['id'] ?>" onclick="return confirm('Are you sure?');">Delete</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
