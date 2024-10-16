import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/login.css'; // Importa el archivo de estilos

const LoginContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const loginContainerRef = useRef(null);
    const navigate = useNavigate(); // Instancia de useNavigate

    const handleLogin = () => {
        // Redirige a la ruta "/profile"
        navigate('/profile');
        // Cierra el menú después de la redirección
        closeMenu();
    };

    return (
        <div
            ref={loginContainerRef}
            className={`loginContainer ${activeMenu === 'login' ? 'active' : ''}`}
        >
            {/* Usa la misma clase que el botón de iniciar sesión */}
            <button className="loginButton" onClick={closeMenu}>X</button>
            <h2>Iniciar Sesión</h2>
            <input type="text" placeholder="Correo electrónico" />
            <input type="password" placeholder="Contraseña" />
            {/* Modifica el botón para que llame a la función handleLogin */}
            <button className="loginButton" onClick={handleLogin}>
                Iniciar Sesión
            </button>
            <div className="login-footer">
                <p>
                    ¿No tienes cuenta? 
                    <a href="/email-validation" onClick={closeMenu} className="create-account-link">
                        Crear una cuenta
                    </a>
                </p>
                <p>
                    ¿Olvidaste tu contraseña? 
                    <a href="/recuperar-contraseña" onClick={closeMenu}>
                        Recuperar contraseña
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginContainer;
