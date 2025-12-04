<?php
include 'conexion.php';

$email = $_POST['email'];
$password = $_POST['password'];
$confirm = $_POST['confirm_password'];

if ($password !== $confirm) {
    echo "<script>alert('Las contraseñas no coinciden'); window.location.href='../Registro.html';</script>";
    exit();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (email, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $passwordHash);

if ($stmt->execute()) {

    // 🔥 REDIRECCIÓN AL LOGIN LUEGO DE REGISTRARSE
    echo "<script>alert('Registrado correctamente'); window.location.href='../Login.html';</script>";
} else {
    echo "<script>alert('Error al registrar'); window.location.href='../Registro.html';</script>";
}

$conn->close();
?>
