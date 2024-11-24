import React from 'react';
import { useLocation } from 'react-router-dom'; // Importar useLocation
import '../../css/components/signin/accordion.css'; // Importar estilos CSS para AccordionContainer

const AccordionContainer = ({ isAccordionOpen = [], toggleAccordion }) => {
    // Verificar que toggleAccordion sea una función para evitar errores
    const handleToggle = (index) => {
        if (typeof toggleAccordion === 'function') {
            toggleAccordion(index);
        }
    };

    const isEmailValidationRoute = location.pathname === '/email-validation-2';

    return (
        <div  className={`accordion-container ${isEmailValidationRoute ? 'email-validation-padding' : ''}`}>
            <div className="accordion-group1">
                <p className="tittle-accordion-group">AL CREAR UNA CUENTA PODEMOS</p>

                {/* Acordeón 1 */}
                <div
                    className={`accordion-item ${isAccordionOpen[0] ? 'open' : ''}`}
                    onClick={() => handleToggle(0)}
                >
                    <div className="accordion-row">
                        <div className="accordion-icon">
                            <span className="material-symbols-outlined">mail</span>
                            <label className="accordion-header-text">Texto visible acordeón 1</label>
                        </div>
                    </div>
                    {isAccordionOpen[0] && (
                        <div className="accordion-body">
                            <p>Texto oculto del acordeón 1</p>
                        </div>
                    )}
                </div>

                {/* Acordeón 2 */}
                <div
                    className={`accordion-item ${isAccordionOpen[1] ? 'open' : ''}`}
                    onClick={() => handleToggle(1)}
                >
                    <div className="accordion-row">
                        <div className="accordion-icon">
                            <span className="material-symbols-outlined">person</span>
                            <label className="accordion-header-text">Texto visible acordeón 2</label>
                        </div>
                    </div>
                    {isAccordionOpen[1] && (
                        <div className="accordion-body">
                            <p>Texto oculto del acordeón 2</p>
                        </div>
                    )}
                </div>

                {/* Acordeón 3 */}
                <div
                    className={`accordion-item ${isAccordionOpen[2] ? 'open' : ''}`}
                    onClick={() => handleToggle(2)}
                >
                    <div className="accordion-row">
                        <div className="accordion-icon">
                            <span className="material-symbols-outlined">favorite</span>
                            <label className="accordion-header-text">Texto visible acordeón 3</label>
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
                <p className="tittle-accordion-group">AL CREAR UNA CUENTA PODEMOS</p>

                {/* Acordeón 4 */}
                <div
                    className={`accordion-item ${isAccordionOpen[3] ? 'open' : ''}`}
                    onClick={() => handleToggle(3)}
                >
                    <div className="accordion-row">
                        <div className="accordion-icon">
                            <span className="material-symbols-outlined">phone_iphone</span>
                            <label className="accordion-header-text">Texto visible acordeón 4</label>
                        </div>
                    </div>
                    {isAccordionOpen[3] && (
                        <div className="accordion-body">
                            <p>Texto oculto del acordeón 4</p>
                        </div>
                    )}
                </div>

                {/* Acordeón 5 */}
                <div
                    className={`accordion-item ${isAccordionOpen[4] ? 'open' : ''}`}
                    onClick={() => handleToggle(4)}
                >
                    <div className="accordion-row">
                        <div className="accordion-icon">
                            <span className="material-symbols-outlined">star</span>
                            <label className="accordion-header-text">Texto visible acordeón 5</label>
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
    );
};

export default AccordionContainer;
