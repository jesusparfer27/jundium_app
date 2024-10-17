// src/components/LoginContainer.jsx
import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/login.css';

const LoginContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const loginContainerRef = useRef(null);
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault(); // Previene el envío por defecto del formulario
        navigate('/profile');
        closeMenu();
    };

    return (
        <div
            ref={loginContainerRef}
            className={`loginContainer ${activeMenu === 'login' ? 'active' : ''}`}
        >
            {/* Primer div: logIn */}
            <div className="logIn">
                <div className='logInHeader'>
                    <h2 className='logInH2'>Iniciar Sesión</h2>
                    <button className="closeContainerLogin" onClick={closeMenu}>X</button>
                </div>
                <div className="accountText">
                    <p>Ya tengo cuenta</p>
                </div>
                <div className="mandatoryFields">
                    <p>Campos obligatorios *</p>
                </div>
                <div className="inputField">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email"/>
                </div>
                <div className="inputField">
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password"/>
                    <a href="/recuperar-contraseña" className="forgotPassword">Recuperar contraseña</a>
                </div>
                <div className="additionalText">
                    <p>Texto adicional aquí</p>
                </div>
                <div className="submitButton">
                    <button className='buttonSubmitLogIn' type="submit" onClick={handleLogin}>Iniciar Sesión</button>
                </div>
            </div>

            {/* Segundo div: SignIn */}
            <div className="signIn">
                <div className="welcomeText">
                    <p>Texto de bienvenida</p>
                </div>
                <div className="extraText">
                    <p>Otro texto aquí</p>
                </div>
                <div className="registerButton">
                    <button className='buttonSubmitSignIn'>Registrarse</button>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;
