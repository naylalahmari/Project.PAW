<?php
require_once 'db_connect.php';

$pdo = getConnection();

if ($pdo) {
    echo "Connection successful!";
} else {
    echo "Connection failed!";
}
