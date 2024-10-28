import React, { useState, useEffect } from 'react';
import '../css/pages/emailsignin.css';
import AccordionContainer from '../components/signin/AccordionContainer';
import { useNavigate } from 'react-router-dom';

export const EmailSignIn = () => {
    const navigate = useNavigate();
    const [isAccordionOpen, setIsAccordionOpen] = useState([false, false, false, false, false, false, false, false]);
    const [apiData, setApiData] = useState(null);
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [emailRequired, setEmailRequired] = useState(false);
    const { VITE_API_BACKEND } = import.meta.env;

    const toggleAccordion = (index) => {
        const updatedState = [...isAccordionOpen];
        updatedState[index] = !updatedState[index];
        setIsAccordionOpen(updatedState);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${VITE_API_BACKEND}/sign-in`);
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                const data = await response.json();
                setApiData(data.data);
            } catch (error) {
                console.error("Error al obtener datos:", error.message);
            }
        };

        fetchData();
    }, [VITE_API_BACKEND]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailExists(false);
        setEmailRequired(false);
    };

    const handleEmailConfirmChange = (event) => {
        setEmailConfirm(event.target.value);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);

        if (!email) {
            setEmailRequired(true);
            return;
        }

        if (!validateEmail(email)) {
            setEmailExists(false);
            // manejar el error de email no válido aquí si es necesario
            return;
        }

        if (email === emailConfirm) {
            if (apiData) {
                const exists = apiData.some(user => user.email === email);
                setEmailExists(exists);

                if (!exists) {
                    localStorage.setItem('userEmail', email);
                    navigate('/email-validation-2');
                }
            }
        } else {
            setEmailExists(false);
        }
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
                                    <input
                                        type="text"
                                        placeholder="Introduce tu email"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                {emailRequired && (
                                    <p className="error-message">El email es obligatorio.</p>
                                )}
                                <label className="email-validation-label">Confirmar Email</label>
                                <div className="email-validation-input">
                                    <input
                                        type="text"
                                        placeholder="Confirma tu email"
                                        value={emailConfirm}
                                        onChange={handleEmailConfirmChange}
                                    />
                                </div>
                                {emailExists && (
                                    <p className="error-message">El email ya está registrado.</p>
                                )}
                                {submitAttempted && email !== emailConfirm && (
                                    <p className="error-message">Los emails no coinciden.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="submit-button-container">
                        <button
                            className="submit-button-emailValidation"
                            onClick={handleSubmit}
                        >
                            Enviar
                        </button>
                    </div>
                </div>

                <AccordionContainer
                    isAccordionOpen={isAccordionOpen}
                    toggleAccordion={toggleAccordion}
                />
            </div>
        </section>
    );
};

export default EmailSignIn;
