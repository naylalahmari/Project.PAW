<?php

require 'db_connect.php';
$db = getConnection();

$sql = "SELECT * FROM attendance_sessions ORDER BY date DESC";
$stmt = $db->query($sql);
$sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<link rel="stylesheet" href="style.css">

<h2>Attendance Sessions</h2>
<table border="1" cellpadding="8">
    <tr>
        <th>ID</th>
        <th>Course</th>
        <th>Group</th>
        <th>Date</th>
        <th>Opened By</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>

    <?php foreach ($sessions as $s): ?>
        <tr>
            <td><?= $s['id'] ?></td>
            <td><?= $s['course_id'] ?></td>
            <td><?= $s['group_id'] ?></td>
            <td><?= $s['date'] ?></td>
            <td><?= $s['opened_by'] ?></td>
            <td><?= $s['status'] ?></td>
            <td>
                <?php if ($s['status'] == 'open'): ?>
                    <a href="close_session.php?id=<?= $s['id'] ?>">Close</a>
                <?php else: ?>
                    Closed
                <?php endif; ?>
            </td>
        </tr>
    <?php endforeach; ?>
</table>