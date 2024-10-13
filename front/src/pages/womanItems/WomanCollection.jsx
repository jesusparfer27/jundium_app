import React, { useState, useEffect } from 'react';
import '../../css/pages/womancollection.css'; // Archivo CSS para los estilos

export const WomanCollection = () => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        // Manejar el desplazamiento de la ventana
        const handleScroll = () => {
            const offsetY = window.scrollY; // Obtener el desplazamiento vertical
            const newScale = 1 + offsetY / 7000; // Calcular el nuevo valor de escala
            setScale(newScale); // Actualizar el estado del zoom
        };

        window.addEventListener('scroll', handleScroll); // Agregar el listener al scroll

        return () => {
            window.removeEventListener('scroll', handleScroll); // Limpiar el listener al desmontar el componente
        };
    }, []);

    return (
        <section className="womanCollectionSection">
            <div
                className="videoWrapper"
                style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease' }} // Aplicar el estilo de zoom
            >
                <video
                    width="100%"
                    height="auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="scrollVideo"
                >
                    <source src="ruta/a/tu/video.mp4" type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                </video>
            </div>
            {/* Resto del contenido de la sección */}
        </section>
    );
};
