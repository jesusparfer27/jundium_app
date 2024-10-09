import { useEffect } from "react";
import '../css/components/homevideo.css';
import videoHome from '../assets/12421669_3840_2160_30fps.mp4'; // Importar el video

export const HomeVideo = () => {
    useEffect(() => {
        const handleScroll = () => {
            const logo = document.querySelector('.logoContainer');
            const overlay = document.querySelector('.overlay');
            const scrollY = window.scrollY;

            // Fijar el logo a 10% desde la parte inferior del viewport menos el scroll
            logo.style.bottom = `${10 + scrollY * 0.1}%`; // Aumentar el desplazamiento del logo hacia arriba

            // Cambiar la opacidad del overlay según el desplazamiento
            const opacity = Math.min(0.5, scrollY / 400); // Ajusta el divisor para controlar la velocidad del cambio de opacidad
            overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`; // Cambiar el color de fondo del overlay
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <main>
            
        </main>
    );
};
