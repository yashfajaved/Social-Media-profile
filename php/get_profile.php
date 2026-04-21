<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(0);
ini_set('display_errors', 0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "leohub_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Get profile for a specific user (default to yashfa_javed)
$username = isset($_GET['username']) ? $_GET['username'] : 'yashfa_javed';

$sql = "SELECT id, username, full_name, email, phone, bio, avatar_url, cover_url, 
               location, website, posts_count, followers_count, following_count, is_verified 
        FROM user_profile WHERE username = '$username'";

$result = $conn->query($sql);
$user = null;

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
}

echo json_encode(["success" => true, "user" => $user]);
$conn->close();
?>