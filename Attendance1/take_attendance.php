<?php
require_once 'db_connect.php'; // ton fichier de connexion à la BDD

$pdo = getConnection(); // récupère la connexion

// 1. Récupérer tous les étudiants depuis la table `students`
$stmt = $pdo->query("SELECT * FROM students ORDER BY fullname ASC");/*requette sql de selection des etudiants*/
$students = $stmt->fetchAll(PDO::FETCH_ASSOC);/*recupere tous les etudiants sous forme de tableau associatif*/

$today = date("Y-m-d");/*date du jour*/
$attendanceFile = "attendance_" . $today . ".json";/*fichier de presence du jour*/

// 2. Formulaire soumis
if ($_SERVER["REQUEST_METHOD"] === "POST") {/*verifie si le formulaire est soumis*/
    
    if (file_exists($attendanceFile)) {/*verifie si le fichier de presence existe deja*/
        die("⚠️ Attendance for today has already been taken.");/*message d'erreur si la presence a deja ete prise*/
    }

    $attendance = [];
    foreach ($students as $student) {
        $id = $student['id'];
        $status = $_POST['status'][$id] ?? 'absent';

        $attendance[] = [
            "student_id" => $id,
            "status" => $status
        ];
    }

    file_put_contents($attendanceFile, json_encode($attendance, JSON_PRETTY_PRINT));
    echo "✅ Attendance saved for $today.";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Take Attendance</title>
</head>
<body>

<h2>Take Attendance</h2>

<?php
if (file_exists($attendanceFile)) {
    echo "<p style='color:red;'>⚠️ Attendance for today has already been taken.</p>";
    exit;
}
?>

<form method="POST">
    <?php foreach ($students as $student): ?>
        <p>
            <strong>
                <?= htmlspecialchars($student['fullname']); ?> (ID: <?= $student['id']; ?>)
            </strong><br>

            <label>
                <input type="radio" name="status[<?= $student['id']; ?>]" value="present" checked>
                Present
            </label>

            <label>
                <input type="radio" name="status[<?= $student['id']; ?>]" value="absent">
                Absent
            </label>
        </p>
    <?php endforeach; ?>

    <button type="submit">Submit Attendance</button>
</form>

</body>
</html>
