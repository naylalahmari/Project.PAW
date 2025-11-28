<?php
require 'db_connect.php';/*inclue le fichier de cnx a la bdd*/

if ($_SERVER['REQUEST_METHOD'] === 'POST') {/*verifie si le formulaire est soumis*/
    $fullname = $_POST['fullname'] ?? '';/*recupere le nom complet*/
    $matricule = $_POST['matricule'] ?? '';/*recupere le matricule*/
    $group_id = $_POST['group_id'] ?? '';/*recupere l'id du groupe*/

    if ($fullname && $matricule && $group_id) {/*veridie que tout les champs sont remplis*/
        $db = getConnection();/*recupere la cnx a la bdd*/

        if ($db) {/*veridie si la cnx est reussie*/
            $sql = "INSERT INTO students (fullname, matricule, group_id) VALUES (?, ?, ?)";/*requette sql d'insertion*/
            $stmt = $db->prepare($sql);/*prepare la requette*/

            try { /*essaie d'excuter la requette*/
                $stmt->execute([$fullname, $matricule, $group_id]);/*execute la requette avec les valeurs*/
                echo "Student added successfully.";/*message de succes*/
            } catch (PDOException $e) {/*attrape les erreurs d'execution*/
                echo "Error adding student: " . $e->getMessage();/*affiche le message d'erreur*/
            }
        } else {
            echo "Database connection failed!";/*message d'erreur de cnx*/
        }
    } else {
        echo "Please fill all the fields.";/*message d'erreur de champs vides*/
    }
}
?>

<form method="POST">
    <input type="text" name="fullname" placeholder="Full name"><br><br>
    <input type="text" name="matricule" placeholder="Matricule"><br><br>
    <input type="number" name="group_id" placeholder="Group ID"><br><br>
    <button type="submit">Add Student</button>
</form>
