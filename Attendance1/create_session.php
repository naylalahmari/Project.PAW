<?php
require 'db_connect.php';
$db = getConnection();

if (!$db) die("Database connection failed!");/*verifie si la cnx est reussie*/

// Test si le formulaire est soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {/*verifie si le formulaire est soumis*/
    // Récupérer les valeurs du formulaire
    $course_id = $_POST['course_id'] ?? null;/*recupere l'id du cours*/
    $group_id = $_POST['group_id'] ?? null;/*recupere l'id du groupe*/
    $opened_by = $_POST['opened_by'] ?? null;/*recupere l'id du prof*/

    if (!$course_id || !$group_id || !$opened_by) {/*verifie que tout les champs sont remplis*/
        $message = "All fields are required!";/*message d'erreur de champs vides*/
    } else {
        try {
            $sql = "INSERT INTO attendance_sessions (course_id, group_id, opened_by) VALUES (?, ?, ?)";/*requette sql d'insertion*/
            $stmt = $db->prepare($sql);/*prepare la requette*/
            $stmt->execute([$course_id, $group_id, $opened_by]);/*execute la requette avec les valeurs*/
            $session_id = $db->lastInsertId();/*recupere l'id de la session creee*/
            $message = "Session created successfully! Session ID = $session_id";/*message de succes*/
        } catch (PDOException $e) {/*attrape les erreurs d'execution*/
            $message = "Error creating session: " . $e->getMessage();/*affiche le message d'erreur*/
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
