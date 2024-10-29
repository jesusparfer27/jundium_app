import React, { useState, useEffect } from 'react';
import '../css/pages/second_step_sign_in.css';
import { useNavigate } from 'react-router-dom';
import AccordionContainer from '../components/signin/AccordionContainer';

export const SecondStepSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    genero: '',
    nombre: '',
    apellido: '',
    aceptar: false
  });
  const [error, setError] = useState(''); // Estado para el mensaje de error
  const {VITE_API_BACKEND} = import.meta.env

  useEffect(() => {
    // Verificar los datos guardados en localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userData = localStorage.getItem('userData');
    
    console.log("Datos en localStorage:");
    console.log("userEmail:", userEmail);
    console.log("userData:", userData ? JSON.parse(userData) : null);
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
    if (error) setError(''); // Limpia el error al cambiar cualquier campo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, genero, nombre, apellido, aceptar } = formData;
  
    // Validaciones básicas
    if (!password || !confirmPassword || !genero || !nombre || !apellido || !aceptar) {
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
  
    // Crear un objeto de datos del usuario
    const userData = { 
      email: localStorage.getItem('userEmail'), // si se guarda en el primer paso
      password,
      first_name: nombre,
      last_name: apellido,
      gender: genero
   };
   
  
    // Log de los datos que se enviarán a la colección accounts
    console.log("Datos a enviar a la colección accounts:", userData);
  
    try {
      // Realizar la solicitud POST al endpoint de usuarios
      const response = await fetch(`${VITE_API_BACKEND}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // Convertir a JSON
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }
  
      // Si el usuario se crea correctamente, almacenar datos en localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
  
      // Navegar al perfil
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setError('Hubo un problema al crear la cuenta.'); // Muestra un error si la solicitud falla
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
                id="genero"
                className="input-field"
                value={formData.genero}
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
                id="nombre"
                className="input-field"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                className="input-field"
                value={formData.apellido}
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
