import React, { useState } from 'react';
import '../css/pages/emailsignin.css'; // Importar estilos CSS
import AccordionContainer from '../components/signin/AccordionContainer'; // Importar el componente AccordionContainer

export const EmailSignIn = () => {
    const [isAccordionOpen, setIsAccordionOpen] = useState([false, false, false, false, false, false, false, false]);

    const toggleAccordion = (index) => {
        const updatedState = [...isAccordionOpen];
        updatedState[index] = !updatedState[index];
        setIsAccordionOpen(updatedState);
    };

    return (
        <section className="email-signin-section">
            <div className="main-content">
                <div className="form-button-container">
                    <div className="first-container">
                        <div className="insert-email">
                            <div className="email-group">
                                <label className="email-label">Email</label>
                                <div className="email-input">
                                    <input type="text" placeholder="Introduce tu email" />
                                </div>
                                <label className="email-validation-label">Confirmar Email</label>
                                <div className="email-validation-input">
                                    <input type="text" placeholder="Confirma tu email" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="submit-button-container">
                        <button
                            className="submit-button-emailValidation"
                            onClick={() => {
                                window.location.href = '/email-validation-2'; // Ruta a la página de instrucciones
                            }}
                        >
                            Enviar
                        </button>
                    </div>
                </div>

                {/* Componente AccordionContainer */}
                <AccordionContainer
                    isAccordionOpen={isAccordionOpen}
                    toggleAccordion={toggleAccordion}
                />
            </div>
        </section>
    );
};

export default EmailSignIn;
