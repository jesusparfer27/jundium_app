import React, { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import '../../css/components/footer/footer.css';
import { useUser } from '../../hooks/useUser';

const Footer = () => {
    const location = useLocation();
    const isHomeOrWomenCollection = location.pathname === '/' || location.pathname === '/woman-collection';
    
    // Estado para controlar la clase activa
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null); // Mensaje de error o éxito
    const [isInputActive, setIsInputActive] = useState(false);
    const { VITE_API_BACKEND } = import.meta.env

    const { user } = useUser(); // Usa el hook useUser para obtener el usuario logueado
    const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
    const loggedUserEmail = loggedUser.email || '';
    console.log('Usuario desde useUser:', user);


    // Función para manejar el cambio en el input
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setEmail(newValue);
        setIsInputActive(newValue !== '');
        setMessage(null); // Limpiar mensajes al cambiar el input
    };

    // Manejar suscripción al boletín
    // Manejar suscripción al boletín
const handleSubscribe = async () => {
    console.log("Función handleSubscribe llamada"); // Verifica si handleSubscribe se llama
    console.log(localStorage.getItem('user'));

    
    if (!email) {
        setMessage(
            <span>
                Inserta una dirección válida
            </span>
        );
        return;
    }

    console.log("Email ingresado:", email); // Verifica el valor de email
    console.log("Usuario logueado con correo:", user.email); // Verifica el correo del usuario logueado

    if (!loggedUser && !user) {
        setMessage(
          <span>
            No estás logueado. Por favor, <NavLink to="/login">inicia sesión</NavLink>.
          </span>
        );
        return;
      }
      

    // Verificar si el correo coincide con el del usuario loggeado
    if (email !== loggedUserEmail) {
        setMessage(
            <span>
                Debes registrarte antes <NavLink to="/email-signin">aquí</NavLink>.
            </span>
        );
        return;
    }
    console.log(loggedUserEmail)

    try {
        const token = localStorage.getItem('authToken');
        
        console.log("Usuario logueado detectado con token:", token); // Verifica el token
        console.log("Correo enviado al parámetro:", email); // Verifica el correo que se enviará

        const response = await fetch(`${VITE_API_BACKEND}/newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        if (response.ok && result.success) {
            setMessage("Éxito al suscribirse a la newsletter");
        } else {
            setMessage(result.message || "Error en la suscripción.");
        }
    } catch (error) {
        setMessage("Error al suscribir a la newsletter.");
        console.error("Error al suscribir a la newsletter:", error);
    }
};

    

    return (
        <footer className={isHomeOrWomenCollection ? 'footer-light' : 'footer-dark'}>
            <div className="footerSuperior">
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

                <div className="footerSubscriptionContainer">
                    <p>Suscríbete a nuestro boletín para recibir actualizaciones</p>
                    <div className="subscriptionInputContainer">
                        <input
                            type="text"
                            className={`input_subscribeNewsletter ${isInputActive ? 'active' : ''}`}
                            placeholder="Introduce tu correo electrónico"
                            value={email}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSubscribe}>Suscribirse</button>
                    </div>
                    {message && <span className="subscriptionMessage">{message}</span>}
                    <strong>¡Mantente informado!</strong>
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
                <div className="footerBottomRow">
                    <div>LOGO</div>
                    <p>Déjanos tus comentarios y sugerencias</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
