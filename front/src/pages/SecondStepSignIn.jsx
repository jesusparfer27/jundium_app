import React, { useState, useEffect } from 'react';
import '../css/pages/second_step_sign_in.css';
import { useNavigate } from 'react-router-dom';
import AccordionContainer from '../components/signin/AccordionContainer';

export const SecondStepSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    gender: '',
    first_name: '',
    last_name: '',
    aceptar: false
  });
  const [error, setError] = useState(''); // Estado para el mensaje de error

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
    if (error) setError(''); // Limpia el error al cambiar cualquier campo
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (!savedEmail) {
      setError('El correo electrónico no está definido. Vuelve al paso anterior.');
    } else {
      setFormData((prevData) => ({ ...prevData, email: savedEmail }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, gender, first_name, last_name, aceptar } = formData;
  

    if (!email) {
      setError('El correo electrónico no está definido. Vuelve al paso anterior.');
      return;
    }
    // Validaciones básicas
    if (!password || !confirmPassword || !gender || !first_name || !last_name || !aceptar) {
      setError('Por favor, completa todos los campos y acepta la política de privacidad.');
      return;
    }
  
    // Verificar si la contraseña es suficientemente fuerte
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
  
    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
  
    try {
      // Almacenar datos en la base de datos (o enviarlos al backend)
      const userData = { email: formData.email, password, gender, first_name, last_name };
      const registerResponse = await fetch(`${import.meta.env.VITE_API_BACKEND}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      if (!registerResponse.ok) {
        throw new Error('Error al registrar al usuario.');
      }
  
      // Realizar inicio de sesión automático
      const loginResponse = await fetch(`${import.meta.env.VITE_API_BACKEND}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password }),
      });
  
      if (!loginResponse.ok) {
        throw new Error('Error al iniciar sesión automáticamente.');
      }
  
      const loginData = await loginResponse.json();
      localStorage.setItem('authToken', loginData.token); // Almacena el token en localStorage
  
      // Redirigir al perfil
      navigate('/profile');
    } catch (error) {
      console.error('Error en el registro o inicio de sesión automático:', error);
      setError('Hubo un problema al completar el registro. Intenta nuevamente.');
    }
  };
  


  const accordionData = [
    { titulo: 'Sección 1', contenido: 'Contenido de la sección 1' },
    { titulo: 'Sección 2', contenido: 'Contenido de la sección 2' }
  ];

  return (
    <section className="second-step-sign-in">
      <div className="contenedor second-step-sign-in-container">
        <div className="header">
          <h2>CREAR UNA CUENTA</h2>
        </div>
        <div className="registro-proceso">
          <div className="progreso">
            <p>Proceso del registro (2/3)</p>
          </div>
          <div className="input-password">
            <label htmlFor="password">Contraseña</label>
            <input
              className='password-validation input-field'
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              className='password-validation input-field'
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {error && <p className="error-message">{error}</p>} {/* Muestra el mensaje de error */}
          </div>
        </div>
        <div className="informacion-adicional">
          <div className="progreso-info">
            <p>Progreso del registro</p>
          </div>
          <div className="campos">
            <div className="campo">
              <label htmlFor="genero">Género</label>
              <select
                id="gender"
                className="input-field"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="first_name"
                className="input-field"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="last_name"
                className="input-field"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="politica-privacidad">
          <input
            className='checkbox-terms'
            type="checkbox"
            id="aceptar"
            checked={formData.aceptar}
            onChange={handleChange}
          />
          <label htmlFor="aceptar">Acepto la política de privacidad</label>
        </div>
        <div className="boton-continuar">
          <button onClick={handleSubmit} className="submit-button2">
            Continuar
          </button>
        </div>
      </div>
      <AccordionContainer data={accordionData} />
    </section>
  );
};

export default SecondStepSignIn;