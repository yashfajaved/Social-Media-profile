<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(0);
ini_set('display_errors', 0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "leohub_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$full_name = isset($data['full_name']) ? $data['full_name'] : '';
$email = isset($data['email']) ? $data['email'] : '';
$phone = isset($data['phone']) ? $data['phone'] : '';
$bio = isset($data['bio']) ? $data['bio'] : '';
$location = isset($data['location']) ? $data['location'] : '';
$website = isset($data['website']) ? $data['website'] : '';
$username = isset($data['username']) ? $data['username'] : 'yashfa_javed';

$sql = "UPDATE user_profile SET 
        full_name = '$full_name',
        email = '$email',
        phone = '$phone',
        bio = '$bio',
        location = '$location',
        website = '$website'
        WHERE username = '$username'";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to update profile"]);
}

$conn->close();
?><?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(0);
ini_set('display_errors', 0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "leohub_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$full_name = isset($data['full_name']) ? $data['full_name'] : '';
$email = isset($data['email']) ? $data['email'] : '';
$phone = isset($data['phone']) ? $data['phone'] : '';
$bio = isset($data['bio']) ? $data['bio'] : '';
$location = isset($data['location']) ? $data['location'] : '';
$website = isset($data['website']) ? $data['website'] : '';
$username = isset($data['username']) ? $data['username'] : 'yashfa_javed';

$sql = "UPDATE user_profile SET 
        full_name = '$full_name',
        email = '$email',
        phone = '$phone',
        bio = '$bio',
        location = '$location',
        website = '$website'
        WHERE username = '$username'";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to update profile"]);
}

$conn->close();
?>