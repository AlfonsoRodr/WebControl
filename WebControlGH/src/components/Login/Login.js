import React, { useState } from 'react'; // Importa React y el hook useState
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para la navegación
import '../../css/Login.css'; // Importa los estilos específicos de Login

// Componente Login
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Manejador de envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        //console.log('Username:', username, 'Password:', password);
        // Aquí agregarías tu lógica de autenticación
        /*
            
        // Datos para enviar al servidor
        const credentials = { username, password };

        try {
            const response = await fetch('http://yourserver.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                // Aquí puedes guardar el token recibido en localStorage o manejo de estado
                localStorage.setItem('token', data.token); // Guardar token
                navigate('/home'); // Navegar al Home si el login es exitoso
            } else {
                throw new Error(data.message || 'Failed to login');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Manejar errores de autenticación aquí, por ejemplo, mostrar un mensaje al usuario
        }

        */

        // Si es exitosa, redirige:
        navigate('/home/gestion-obras'); // Redirige a la página de gestión de obras
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>LOGIN</h2>
                <div className="input-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-button">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default Login; // Exporta el componente Login como predeterminado
