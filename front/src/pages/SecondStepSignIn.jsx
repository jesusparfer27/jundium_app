import React from 'react';
import '../css/pages/second_step_sign_in.css'
import { useNavigate } from 'react-router-dom';

export const SecondStepSignIn = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se pueden agregar validaciones o lógica adicional antes de navegar
    navigate('/profile');
  };

  return (
    <>
      <section className="second-step-sign-in">
        <div className="contenedor second-step-sign-in-container">
          {/* Primer div: Header */}
          <div className="header">
            <h2>CREAR UNA CUENTA</h2>
          </div>

          {/* Segundo div: Proceso del registro y contraseña */}
          <div className="registro-proceso">
            <div className="progreso">
              <p>Proceso del registro (2/3)</p>
            </div>
            <div className="input-password">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" />
            </div>
          </div>

          {/* Tercer div: Información adicional */}
          <div className="informacion-adicional">
            <div className="progreso-info">
              <p>Progreso del registro</p>
            </div>
            <div className="campos">
              <div className="campo">
                <label htmlFor="genero">Género</label>
                <select id="genero">
                  <option value="">Seleccione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" />
              </div>
              <div className="campo">
                <label htmlFor="apellido">Apellido</label>
                <input type="text" id="apellido" />
              </div>
            </div>
          </div>

          {/* Cuarto div: Aceptación de política de privacidad */}
          <div className="politica-privacidad">
            <input type="checkbox" id="aceptar" />
            <label htmlFor="aceptar">Acepto la política de privacidad</label>
          </div>

          {/* Quinto div: Botón de continuar */}
          <div className="boton-continuar">
            <button onClick={handleSubmit} className="submit-button2">
              Continuar
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
