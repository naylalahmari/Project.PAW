<?php

function getConnection() {/*fonction de connexion a la BDD*/
    // Charger la configuration
    $config = include 'config.php';/*inclut le fichier de config*/

    try {
        // Créer la connexion PDO
        $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset=utf8";/*chaine de connexion*/
        $pdo = new PDO($dsn, $config['username'], $config['password']);/*cree une nouvelle connexion PDO*/

        // Activer les erreurs PDO
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);/*activer les erreurs d'execution*/

        return $pdo;/*renvoie la connexion reussie*/

    } catch (PDOException $e) {/*rattrape les erreurs de cnx*/

        // Optionnel : enregistrer l’erreur dans un fichier log
        file_put_contents('db_errors.log', date("Y-m-d H:i:s") . " - " . $e->getMessage() . "\n", FILE_APPEND);/*enregistre les erreurs dans un fichier log*/

        return null; // renvoie null si échec
    }
    
}
