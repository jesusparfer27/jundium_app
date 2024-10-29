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

    const { VITE_API_BACKEND, VITE_ACCOUNTS_ENDPOINT } = import.meta.env;

    const handleSignIn = () => {
        navigate('/email-validation'); // Redirige a /email-validation
        closeMenu(); // Cierra el menú
    };
    
    const handleLogin = async (event) => {
        event.preventDefault(); // Previene el envío por defecto del formulario
    
        // Verifica si el email y la contraseña están llenos
        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }
    
        try {
            const url = `${VITE_API_BACKEND}/login`; // URL para la solicitud
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Datos de inicio de sesión
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Guardar el token en localStorage y redirigir al perfil
                localStorage.setItem('authToken', data.token);
                navigate('/profile');
                closeMenu(); // Cierra el menú solo si el inicio de sesión es exitoso
            } else {
                alert(data.message || 'El correo electrónico o contraseña no son correctos.');
            }
        } catch (error) {
            console.error('Error en la solicitud de inicio de sesión:', error);
            alert('Hubo un problema con el inicio de sesión. Inténtalo nuevamente.');
        }
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
                        className='inputLogin_Header'
                    />
                </div>
                <div className="inputField">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password} // Estado para el valor del input
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
                        className='inputLogin_Header'
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
                    <button className='buttonSubmitSignIn' onClick={handleSignIn}>Registrarse</button>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;
