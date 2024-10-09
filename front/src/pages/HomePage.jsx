import { useEffect, useState } from 'react';
import { HomeVideo } from '../components/HomeVideo';
import Header from '../components/header/Header';
import '../css/pages/homepage.css';

export const HomePage = () => {
    const [showContent, setShowContent] = useState(false); // Controla la visibilidad del contenido
    const [overlayVisible, setOverlayVisible] = useState(false); // Controla la visibilidad del overlay

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Cuando se hace scroll hacia abajo y se llega al final del video (200vh)
            if (scrollY >= (2 * viewportHeight)) {
                setShowContent(true); // Muestra el contenido
            } else {
                setShowContent(false); // Oculta el contenido
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <main>
            <Header setOverlayVisible={setOverlayVisible} />
            <HomeVideo />
            {showContent && ( // Renderiza la sección solo si showContent es true
                <section className="contentSection">
                    <h1>Continuamos</h1>
                </section>
            )}
            {overlayVisible && <div className="overlay" onClick={() => setOverlayVisible(false)}></div>} {/* Superposición para cerrar */}
        </main>
    );
};
