import '../../css/components/footer/footer.css';

const Footer = () => {
    return (
        <footer>
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
                </div>
            </div>

            <div className="footerInferior">
                {/* Línea de separación */}
                <div className="footerLineSeparation"></div>
                
                {/* Contenedor con input y párrafo */}
                <div className="footerBottomRow">
                    <input type="text" placeholder="Escribe un comentario..." />
                    <p>Déjanos tus comentarios y sugerencias</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
