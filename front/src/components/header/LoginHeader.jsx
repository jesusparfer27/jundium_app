import React, { useContext, useRef } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/login.css'; // Importa el archivo de estilos

const LoginContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const loginContainerRef = useRef(null);

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
            <button className="loginButton">Iniciar Sesión</button>
            <div className="login-footer">
                <p>¿No tienes cuenta? <a href="/crear-cuenta">Crear una cuenta</a></p>
                <p>¿Olvidaste tu contraseña? <a href="/recuperar-contraseña">Recuperar contraseña</a></p>
            </div>
        </div>
    );
};

export default LoginContainer;
