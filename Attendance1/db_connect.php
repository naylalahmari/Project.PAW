<?php

function getConnection() {
    // Charger la configuration
    $config = include 'config.php';

    try {
        // Créer la connexion PDO
        $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset=utf8";
        $pdo = new PDO($dsn, $config['username'], $config['password']);

        // Activer les erreurs PDO
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $pdo;

    } catch (PDOException $e) {

        // Optionnel : enregistrer l’erreur dans un fichier log
        file_put_contents('db_errors.log', date("Y-m-d H:i:s") . " - " . $e->getMessage() . "\n", FILE_APPEND);

        return null; // renvoie null si échec
    }
    
}
