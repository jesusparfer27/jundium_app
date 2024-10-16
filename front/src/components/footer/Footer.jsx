// src/components/footer/Footer.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/components/footer/footer.css'; // Asegúrate de que esta ruta sea correcta

const Footer = () => {
    const location = useLocation();

    // Determina si estás en la ruta deseada
    const isHomeOrWomenCollection = location.pathname === '/' || location.pathname === '/woman-collection';

    return (
        <footer className={isHomeOrWomenCollection ? 'footer-light' : 'footer-dark'}>
            <div className="footerSuperior">
                {/* Primer contenedor con tres divs y navLinks */}
                <div className="footerLinksContainer">
                    <div className="footerSection">
                        <strong>Acerca de Nosotros</strong>
                        <nav className="linksSections">
                            <a href="#about-us">Quiénes Somos</a>
                            <a href="#careers">Carreras</a>
                            <a href="#press">Prensa</a>
                        </nav>
                    </div>
                    <div className="footerSection">
                        <strong>Soporte</strong>
                        <nav className="linksSections">
                            <a href="#help-center">Centro de Ayuda</a>
                            <a href="#contact-us">Contáctanos</a>   
                            <a href="#faq">Preguntas Frecuentes</a>
                        </nav>
                    </div>
                    <div className="footerSection">
                        <strong>Redes Sociales</strong>
                        <nav className="linksSections">
                            <a href="#facebook">Facebook</a>
                            <a href="#twitter">Twitter</a>
                            <a href="#instagram">Instagram</a>
                        </nav>
                    </div>
                </div>

                {/* Segundo contenedor con un párrafo, barra de búsqueda e input */}
                <div className="footerSubscriptionContainer">
                    <p>Suscríbete a nuestro boletín para recibir actualizaciones</p>
                    <div className="subscriptionInputContainer">
                        <input
                            type="text"
                            placeholder="Introduce tu correo electrónico"
                        />
                        <button>Suscribirse</button>
                    </div>
                    <strong>¡Mantente informado!</strong>

                    {/* Nuevo div para los enlaces a redes sociales */}
                    <div className="socialLinks">
                        <a href="#facebook" title="Facebook">
                            <span className="material-icons">facebook</span>
                        </a>
                        <a href="#twitter" title="Twitter">
                            <span className="material-icons">twitter</span>
                        </a>
                        <a href="#instagram" title="Instagram">
                            <span className="material-icons">instagram</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footerInferior">
                {/* Contenedor con input y párrafo */}
                <div className="footerBottomRow">
                    <div>LOGO</div>
                    <p>Déjanos tus comentarios y sugerencias</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
