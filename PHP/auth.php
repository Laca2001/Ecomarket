<?php
header("Content-Type: application/json");
require_once "conexion.php";

$action = $_POST["action"] ?? null;

if (!$action) {
    echo json_encode(["status" => "error", "message" => "Acción no válida"]);
    exit;
}

if ($action === "register") {
    $nombre = $_POST["nombre"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nombre, $email, $password);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Usuario registrado"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al registrar"]);
    }
}

if ($action === "login") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT id, nombre, password FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id, $nombre, $hash);
    $stmt->fetch();

    if ($stmt->num_rows > 0 && password_verify($password, $hash)) {
        echo json_encode(["status" => "success", "message" => "Login correcto"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Datos incorrectos"]);
    }
}
?>
