import React, { useContext, useRef, useEffect } from 'react';
import { HeaderContext } from '../../context/HeaderContext';import '../../css/components/header/header.css';
import '../../css/components/header/login.css'
import '../../css/components/header/header.css'

const LoginContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const loginContainerRef = useRef(null);


    useEffect(() => {
        if (activeMenu !== 'login') {
            // Aquí podrías añadir lógica para resetear o limpiar el formulario si es necesario
        }
    }, [activeMenu]);

    return (
        <div
            ref={loginContainerRef}
            className={`loginContainer ${activeMenu === 'login' ? 'active' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Iniciar Sesión</h2>
            <input type="text" placeholder="Correo electrónico" />
            <input type="password" placeholder="Contraseña" />
            <button>Iniciar Sesión</button>
            <div className="login-footer">
                <p>
                    ¿No tienes cuenta? <a href="/crear-cuenta">Crear una cuenta</a>
                </p>
                <p>
                    ¿Olvidaste tu contraseña? <a href="/recuperar-contraseña">Recuperar contraseña</a>
                </p>
            </div>
        </div>
    );
};

export default LoginContainer;
