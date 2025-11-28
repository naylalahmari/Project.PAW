<?php
require 'db_connect.php';

$db = getConnection();

if ($db) {/*verifie si la cnx est reussie*/
    $sql = "SELECT * FROM students";/*requette sql de selection des etudiants*/
    $stmt = $db->query($sql);/*execute la requette*/
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);/*recupere tous les etudiants sous forme de tableau associatif*/
} else {
    die("Database connection failed!");/*message d'erreur de cnx*/
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
        <td><?= $student['id'] ?></td><!--affiche l'id de l'etudiant-->
        <td><?= htmlspecialchars($student['fullname']) ?></td><!--utilise htmlspecialchars pour eviter les attaques xss-->
        <td><?= htmlspecialchars($student['matricule']) ?></td><!--utilise htmlspecialchars pour eviter les attaques xss-->
        <td><?= $student['group_id'] ?></td><!--affiche l'id du groupe-->
        <td>
            <a href="update_student.php?id=<?= $student['id'] ?>">Edit</a><!--lien pour editer l'etudiant--> 
            <a href="delete_students.php?id=<?= $student['id'] ?>" onclick="return confirm('Are you sure?');">Delete</a><!--lien pour supprimer l'etudiant avec une confirmation-->
        </td>
    </tr>
    <?php endforeach; ?>
</table>
