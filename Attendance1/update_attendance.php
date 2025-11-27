<?php
require_once 'db_connect.php';

$pdo = getConnection();

// Déterminer la date (aujourd'hui)
$today = date('Y-m-d');
$fileName = "attendance_" . $today . ".json";

// Vérifier si le fichier existe
if (!file_exists($fileName)) {
    die("⚠️ No attendance found for $today. Please take attendance first.");
}

// Charger l'attendance
$attendance = json_decode(file_get_contents($fileName), true);

// Charger les étudiants depuis la BDD
$stmt = $pdo->query("SELECT * FROM students ORDER BY fullname ASC");
$students = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Si le formulaire est soumis : mettre à jour
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($attendance as $index => $att) {
        $id = $att['student_id'];
        $status = $_POST['status'][$id] ?? 'absent';
        $attendance[$index]['status'] = $status;
    }

    file_put_contents($fileName, json_encode($attendance, JSON_PRETTY_PRINT));
    echo "<h2>Attendance updated successfully for $today.</h2>";
    echo "<a href='take_attendance.php'><button>Back to Take Attendance</button></a>";
    exit;
}
?>

<h2>Update Attendance for <?= $today ?></h2>

<form method="POST">
<table border="1" cellpadding="8" cellspacing="0">
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Present / Absent</th>
    </tr>
    <?php foreach ($attendance as $attItem):
        $studentInfo = array_filter($students, fn($s) => $s['id'] == $attItem['student_id']);
        $studentInfo = array_values($studentInfo)[0] ?? null;
        if (!$studentInfo) continue; // ignorer si l'étudiant n'existe plus
    ?>
    <tr>
        <td><?= $studentInfo['id'] ?></td>
        <td><?= htmlspecialchars($studentInfo['fullname']) ?></td>
        <td>
            <label>
                <input type="radio" name="status[<?= $studentInfo['id'] ?>]" value="present" <?= $attItem['status']=='present' ? 'checked' : '' ?>>
                Present
            </label>
            <label>
                <input type="radio" name="status[<?= $studentInfo['id'] ?>]" value="absent" <?= $attItem['status']=='absent' ? 'checked' : '' ?>>
                Absent
            </label>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
<br>
<button type="submit">Update Attendance</button>
</form>
