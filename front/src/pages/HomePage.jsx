import React, { useEffect, useState } from 'react';
import SeasonVideo from '../assets/home-video-season.mp4';
import { NavLink } from 'react-router-dom';
import '../css/pages/homepage.css';
import autumnImage from '../assets/autumn-session-home.jpg';
import winterImage from '../assets/winter-session-home.jpg';

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
        const interval = setInterval(() => {
            setOffset((prevOffset) => (prevOffset >= 100 ? 0 : prevOffset + 100 / productsData.products.length));
        }, 3000); // Cambia la velocidad del desplazamiento a tu gusto

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const offsetY = window.scrollY;
            const newScale = 1 + (offsetY > 100 ? (offsetY - 100) / 7000 : 0); // Ajusta el divisor para modificar la intensidad del zoom
            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <main>
            <section className="videoScrollContainer">
                <div className="videoWrapper">
                    <img
                        className="scrollImage"
                        style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease' }}
                        src={winterImage}
                        alt="Imagen de fondo"
                    />
                </div>
            </section>

            <section className="newCollections">
                <h1 className='h1Style'>Echa un vistazo a los nuevos drops</h1>
                <div className="newDropsHome">
                    {productsData.products.map((product) => (
                        <NavLink
                            to={`/product/${product.id}`}
                            key={product.id}
                            className={({ isActive }) => (isActive ? 'myCustomActiveClass' : 'myCustomClass')}
                        >
                            <div className="imageContainer">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="itemImage"
                                />
                            </div>
                            <div className="itemDescription">
                                <p className='pHome'>{product.name}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </section>

            <section className="container_videoSession-2">
                <div>
                    <NavLink to="/video" className="videoLink">
                        <div className="videoContentWrapper">
                            <video
                                className="videoElement"
                                autoPlay
                                muted
                                loop
                                playsInline
                            >
                                <source src={SeasonVideo} type="video/mp4" />
                                Tu navegador no soporta la reproducción de videos.
                            </video>
                            <div className="textOverlay">
                                <h2>Explora lo nuevo de la temporada</h2>
                                <p>Descubre las últimas colecciones que hemos preparado para ti.</p>
                            </div>
                        </div>
                    </NavLink>
                </div>
            </section>

            <section className="carruselHome">
                <div className="leftTextContainer">
                    <p>Descubre nuestros productos destacados</p>
                </div>
                <div className="rightCarouselContainer">
                    <div className="carousel" style={{ transform: `translateX(-${offset}%)` }}>
                        {/* Repetimos los productos para crear un efecto de carrusel infinito */}
                        {[...productsData.products, ...productsData.products].map((product) => (
                            <NavLink
                                to={`/product/${product.id}`}
                                key={product.id} // Cambia a product.id para evitar claves duplicadas
                                className="carouselItem" // Aquí solo asignamos una clase específica para el carrusel
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="carouselImage"
                                />
                                <p>{product.name}</p>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container_image_autumn stickyVideo">
                <div>
                    <NavLink to="/video" className="videoLink2">
                        <img className='imageAutumn' 
                             style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease' }} 
                             src={autumnImage} 
                             alt="Imagen de otoño" />
                    </NavLink>
                </div>
            </section>

            <section className="newCollections lastSection">
                <h1 className='h1Style'>Echa un vistazo a los nuevos drops</h1>
                <div className="newDropsHome2">
                    {productsData.products.slice(0, 3).map((product) => (
                        <NavLink
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="dropItem"
                        >
                            <div className="imageContainer">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="itemImageDrops"
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
