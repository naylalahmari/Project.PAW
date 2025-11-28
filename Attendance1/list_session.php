<?php

require 'db_connect.php';
$db = getConnection();

$sql = "SELECT * FROM attendance_sessions ORDER BY date DESC";/*requette sql de selection des sessions*/
$stmt = $db->query($sql);/*execute la requette*/
$sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);/*recupere toutes les sessions sous forme de tableau associatif*/
?>
<link rel="stylesheet" href="style.css"><!--inclut le fichier css-->

<h2>Attendance Sessions</h2><!--titre de la page-->
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

    <?php foreach ($sessions as $s): ?><!--boucle pour chaque session-->
        <tr>
            <td><?= $s['id'] ?></td><!--affiche l'id de la session-->
            <td><?= $s['course_id'] ?></td>
            <td><?= $s['group_id'] ?></td>
            <td><?= $s['date'] ?></td>
            <td><?= $s['opened_by'] ?></td>
            <td><?= $s['status'] ?></td>
            <td>
                <?php if ($s['status'] == 'open'): ?><!--verifie si la session est ouverte-->
                    <a href="close_session.php?id=<?= $s['id'] ?>">Close</a><!--lien pour fermer la session-->
                <?php else: ?><!--sinon-->
                    Closed
                <?php endif; ?><!--fin de la condition-->
            </td>
        </tr>
    <?php endforeach; ?><!--fin de la boucle-->
</table>