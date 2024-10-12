import React, { useEffect, useState } from 'react';
import SeasonVideo from '../assets/1321208-uhd_3840_2160_30fps.mp4';
import { NavLink } from 'react-router-dom';
import '../css/pages/homepage.css';

export const HomePage = () => {
    const [offset, setOffset] = useState(0);
    const [scale, setScale] = useState(1); // Estado para el zoom

    const productsData = {
        products: [
            { id: 1, name: "Camiseta Blanca", image: "https://via.placeholder.com/150?text=Camiseta+Blanca", category: "Ropa", description: "Camiseta blanca clásica, de algodón 100%." },
            { id: 2, name: "Pantalones Vaqueros", image: "https://via.placeholder.com/150?text=Pantalones+Vaqueros", category: "Ropa", description: "Pantalones vaqueros ajustados de corte moderno." },
            { id: 3, name: "Zapatillas Deportivas", image: "https://via.placeholder.com/150?text=Zapatillas+Deportivas", category: "Calzado", description: "Zapatillas deportivas ligeras y cómodas." },
            { id: 4, name: "Chaqueta de Cuero", image: "https://via.placeholder.com/150?text=Chaqueta+de+Cuero", category: "Ropa", description: "Chaqueta de cuero negra con forro cálido." },
            { id: 5, name: "Bolso de Mano", image: "https://via.placeholder.com/150?text=Bolso+de+Mano", category: "Accesorios", description: "Bolso de mano elegante, perfecto para eventos." },
            { id: 6, name: "Gorra Azul", image: "https://via.placeholder.com/150?text=Gorra+Azul", category: "Accesorios", description: "Gorra azul clásica con ajuste trasero." },
            { id: 7, name: "Vestido Rojo", image: "https://via.placeholder.com/150?text=Vestido+Rojo", category: "Ropa", description: "Vestido rojo elegante, ideal para ocasiones especiales." },
            { id: 8, name: "Reloj Deportivo", image: "https://via.placeholder.com/150?text=Reloj+Deportivo", category: "Accesorios", description: "Reloj deportivo resistente al agua, con múltiples funciones." }
        ]
    };

    useEffect(() => {
        // Manejar el desplazamiento para el carrusel
        const interval = setInterval(() => {
            setOffset((prevOffset) => (prevOffset >= 100 ? 0 : prevOffset + 0.5));
        }, 30); // Ajusta el valor para cambiar la velocidad del desplazamiento

        return () => clearInterval(interval);
    }, []);

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
        <main>
            <section className="videoScrollContainer">
                <div className="videoWrapper">
                    <video
                        width="100%"
                        height="auto"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="scrollVideo"
                        style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease' }} // Aplicar el estilo de zoom
                    >
                        <source src={SeasonVideo} type="video/mp4" />
                        Tu navegador no soporta la reproducción de videos.
                    </video>
                </div>
            </section>

            <section className="newCollections">
                <h1 className='h1Style'>Echa un vistazo a los nuevos drops</h1>
                <div className="newDropsHome">
                    {productsData.products.map((product) => (
                        <NavLink
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="dropItem"
                        >
                            <div className="imageContainer">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="itemImage"
                                />
                            </div>
                            <div className="itemDescription">
                                <p>{product.name}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </section>

            <section>
                <div className="container_video">
                    <NavLink to="/video" className="videoLink">
                        <video
                            width="100%"
                            height="auto"
                            autoPlay
                            muted
                            loop
                            playsInline
                        >
                            <source src={SeasonVideo} type="video/mp4" />
                            Tu navegador no soporta la reproducción de videos.
                        </video>
                    </NavLink>
                </div>
            </section>
            
            <section className="carruselHome">
                <div className="leftTextContainer">
                    <p>Descubre nuestros productos destacados</p>
                </div>
                <div className="rightCarouselContainer">
                    <div className="carousel" style={{ transform: `translateX(-${offset}%)`, transition: 'transform 0.1s linear' }}>
                        {[...productsData.products, ...productsData.products].map((product, index) => (
                            <div key={index} className="carouselItem">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="carouselImage"
                                />
                                <p>{product.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <div className="container_video">
                    <NavLink to="/video" className="videoLink">
                        <video
                            width="100%"
                            height="auto"
                            autoPlay
                            muted
                            loop
                            playsInline
                        >
                            <source src={SeasonVideo} type="video/mp4" />
                            Tu navegador no soporta la reproducción de videos.
                        </video>
                    </NavLink>
                </div>
            </section>

            <section className="newCollections">
    <h1 className='h1Style'>Echa un vistazo a los nuevos drops</h1>
    <div className="newDropsHome2">
        {productsData.products.slice(0, 3).map((product) => (  // Cambié aquí
            <NavLink
                to={`/product/${product.id}`}
                key={product.id}
                className="dropItem"
            >
                <div className="imageContainer">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="itemImage"
                    />
                </div>
                <div className="itemDescription">
                    <p>{product.name}</p>
                </div>
            </NavLink>
        ))}
    </div>
</section>


        </main>
    );
};
