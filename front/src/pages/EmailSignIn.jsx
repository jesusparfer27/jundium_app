import React, { useState } from 'react';
import '../css/pages/emailsignin.css'; // Importar estilos CSS

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
                            className="submit-button"
                            onClick={() => {
                                window.location.href = '/email-validation-2'; // Ruta a la página de instrucciones
                            }}
                        >
                            Enviar
                        </button>
                    </div>
                </div>

                <div className="accordion-container">
                    <div className="accordion-group1">
                        <p className="tittle-accordion-group">AL CREAR UNA CUENTA PODEMOS</p>

                        {/* Acordeón 1 */}
                        <div className={`accordion-item ${isAccordionOpen[0] ? 'open' : ''}`} onClick={() => toggleAccordion(0)}>
                            <div className="accordion-row">
                                <div className="accordion-icon">
                                    <span className="material-symbols-outlined">mail</span>
                                    <label className='accordion-header-text'>Texto visible acordeón 1</label> {/* Cambiado a label */}
                                </div>
                            </div>
                            {isAccordionOpen[0] && (
                                <div className="accordion-body">
                                    <p>Texto oculto del acordeón 1</p>
                                </div>
                            )}
                        </div>

                        {/* Acordeón 2 */}
                        <div className={`accordion-item ${isAccordionOpen[1] ? 'open' : ''}`} onClick={() => toggleAccordion(1)}>
                            <div className="accordion-row">
                                <div className="accordion-icon">
                                    <span className="material-symbols-outlined">person</span>
                                    <label className='accordion-header-text'>Texto visible acordeón 2</label> {/* Cambiado a label */}
                                </div>
                            </div>
                            {isAccordionOpen[1] && (
                                <div className="accordion-body">
                                    <p>Texto oculto del acordeón 2</p>
                                </div>
                            )}
                        </div>

                        {/* Acordeón 3 */}
                        <div className={`accordion-item ${isAccordionOpen[2] ? 'open' : ''}`} onClick={() => toggleAccordion(2)}>
                            <div className="accordion-row">
                                <div className="accordion-icon">
                                    <span className="material-symbols-outlined">favorite</span>
                                    <label className='accordion-header-text'>Texto visible acordeón 3</label> {/* Cambiado a label */}
                                </div>
                            </div>
                            {isAccordionOpen[2] && (
                                <div className="accordion-body">
                                    <p>Texto oculto del acordeón 3</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="accordion-group2">
                        {/* Acordeón 4 */}
                        <p className="tittle-accordion-group">AL CREAR UNA CUENTA PODEMOS</p>
                        <div className={`accordion-item ${isAccordionOpen[3] ? 'open' : ''}`} onClick={() => toggleAccordion(3)}>
                            <div className="accordion-row">
                                <div className="accordion-icon">
                                    <span className="material-symbols-outlined">
                                        phone_iphone
                                    </span>
                                    <label className='accordion-header-text'>Texto visible acordeón 4</label> {/* Cambiado a label */}
                                </div>
                            </div>
                            {isAccordionOpen[3] && (
                                <div className="accordion-body">
                                    <p>Texto oculto del acordeón 4</p>
                                </div>
                            )}
                        </div>
                        {/* Acordeón 5 */}
                        <div className={`accordion-item ${isAccordionOpen[4] ? 'open' : ''}`} onClick={() => toggleAccordion(4)}>
                            <div className="accordion-row">
                                <div className="accordion-icon">
                                    <span className="material-symbols-outlined">star</span>
                                    <label className='accordion-header-text'>Texto visible acordeón 5</label> {/* Cambiado a label */}
                                </div>
                            </div>
                            {isAccordionOpen[4] && (
                                <div className="accordion-body">
                                    <p>Texto oculto del acordeón 5</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
