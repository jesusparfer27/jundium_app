// src/components/LoginContainer.jsx
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/login.css';

const LoginContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const loginContainerRef = useRef(null);
    const navigate = useNavigate();

    // Estado para los inputs de email y contraseña
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault(); // Previene el envío por defecto del formulario

        // Verifica si el email y la contraseña están vacíos
        if (email && password) {
            navigate('/admin'); // Redirige a /admin si ambos campos están llenos
        } else {
            navigate('/profile'); // Redirige a /profile si los campos están vacíos
        }

        closeMenu(); // Cierra el menú
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
                    <input
                        type="text"
                        id="email"
                        value={email} // Estado para el valor del input
                        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado
                    />
                </div>
                <div className="inputField">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password} // Estado para el valor del input
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
                    />
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
