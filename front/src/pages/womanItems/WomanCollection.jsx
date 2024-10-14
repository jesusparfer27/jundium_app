import React, { useState, useEffect } from 'react';
import '../../css/pages/womancollection.css'; // Archivo CSS para los estilos
import HomeVideo from '../../assets/1321208-uhd_3840_2160_30fps.mp4';
import imageGroup from '../../assets/pexels-fotios-photos-1812527.jpg'; // Importar la imagen de agrupación
import imageCollection from '../../assets/pexels-eberhardgross-28871394.jpg'; // Importar la imagen de colección

export const WomanCollection = () => {
    const [scale, setScale] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 47; // Cambiar a 46 productos por página

    // Simular productos para el ejemplo
    const products = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: `Producto ${index + 1}`,
        price: `$${(index + 1) * 10}`,
        image: 'url_de_la_imagen_aqui', // Puedes reemplazar con la URL de la imagen
    }));

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

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

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
                    <source src={HomeVideo} type="video/mp4" />
                    Tu navegador no soporta la reproducción de videos.
                </video>
            </div>

            <div className="productGrid">
                {currentProducts.map((product, index) => (
                    <React.Fragment key={product.id}>
                        {/* Imagen para la agrupación en la posición del producto 5 */}
                        {index === 4 && (
                            <div className="groupCollection">
                                <a href="/group-collection" className="groupLink">
                                    <div className="groupImage">
                                        <img 
                                            src={imageGroup} 
                                            alt="Agrupación de productos" 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover' 
                                            }} 
                                        />
                                    </div>
                                </a>
                            </div>
                        )}

                        {/* Imagen de la colección de temporada en la posición del producto 34 */}
                        {index === 33 && ( // Cambié de 32 a 33
                            <div className="seasonalCollection">
                                <a href="/season-collection" className="seasonalLink">
                                    <div className="seasonalImage">
                                        <img 
                                            src={imageCollection} 
                                            alt="Colección de temporada" 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover' 
                                            }} 
                                        />
                                    </div>
                                </a>
                            </div>
                        )}

                        {/* Saltar el producto 42 porque ya está ocupado por la agrupación */}
                        {index === 41 ? null : (
                            index !== 4 && index !== 33 && ( // Cambié de 32 a 33
                                <div className="productItem">
                                    <a href={`/product/${product.id}`} className="productLink">
                                        <h4>{product.name}</h4>
                                        <p>{product.price}</p>
                                    </a>
                                </div>
                            )
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="pagination">
                <button
                    className="paginationButton"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                >
                    Anterior
                </button>
                <span className="paginationInfo">
                    Página {currentPage + 1} de {totalPages}
                </span>
                <button
                    className="paginationButton"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage === totalPages - 1}
                >
                    Siguiente
                </button>
            </div>
        </section>
    );
};
