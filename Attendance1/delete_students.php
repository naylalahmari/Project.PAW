<?php
require 'db_connect.php';/*inclut le fichier de connexion a la BDD*/
$db = getConnection();/*récupère la connexion à la BDD*/

if (!$db) die("Database connection failed!");/*verifie si la cnx est reussie*/

$id = $_GET['id'] ?? null;/*recupere l'id de l'etud*/

if ($id) {/*verifie si l'id est present*/
    $sql = "DELETE FROM students WHERE id = ?";/*requette sql de suppression*/
    $stmt = $db->prepare($sql);/*prepare la requette*/

    try {
        $stmt->execute([$id]);/*execute la requette avec l'id*/
        echo "Student deleted.";/*message de succes*/
    } catch (PDOException $e) {/*attrape les erreurs d'execution*/
        echo "Error deleting student: " . $e->getMessage();/*affiche le message d'erreur*/
    }
}

echo "<br><a href='list_students.php'>Back to list</a>";/*lien de retour a la liste des etudiants*/
