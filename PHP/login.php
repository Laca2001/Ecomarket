<?php
session_start();
include 'conexion.php';

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    if (password_verify($password, $usuario['password'])) {
        $_SESSION['user_id'] = $usuario['id'];
        $_SESSION['email'] = $usuario['email'];

        // 🔥 REDIRECCIÓN AL CLIENTE LUEGO DE INICIAR SESIÓN
        header("Location: ../Cliente.html");
        exit();
    } else {
        echo "<script>alert('Contraseña incorrecta'); window.location.href='../Login.html';</script>";
    }
} else {
    echo "<script>alert('El usuario no existe'); window.location.href='../Login.html';</script>";
}

$conn->close();
?>
