import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/pages/homepage.css';

// IMAGES
// HOME-SECTIONS
import SeasonVideo from '../assets/home-sections/home-video-season.mp4';
import AutumnImage from '../assets/home-sections/autumn-session-home.jpg';
import winterImage from '../assets/home-sections/winter-session-home.jpg';

// HOME-ARTICLES
import WomanBags from '../assets/different-articles/example-bags-woman-home.jpg';
import ManBags from '../assets/different-articles/example-bags-men-home.jpg';
import WomanTshirts from '../assets/different-articles/example-tshirts-woman-home.jpg';
import ManTshirts from '../assets/different-articles/example-tshirts-man-home.jpg';
import WomanJackets from '../assets/different-articles/example-jackets-woman-home.jpg';
import ManJackets from '../assets/different-articles/example-jackets-men-home.jpg';
import WomanShoes from '../assets/different-articles/example-shoes-woman-home.jpg';
import ManShoes from '../assets/different-articles/example-shoes-man-home.jpg';

// HOME-NEW-SEASON
import SummerSeason from '../assets/new-season/summer-season-square-home.jpg';
import SpringSeason from '../assets/new-season/spring-season-square-home.jpg';
import WinterSeason from '../assets/new-season/winter-season-square-home.jpg';

export const HomePage = () => {
    const [offset, setOffset] = useState(0);
    const [scale, setScale] = useState(1); // Estado para el zoom

    const categoriesData = [
        { id: 1, name: "Bolsos de Mujer", image: WomanBags, endpoint: "/categories/woman-bags" },
        { id: 2, name: "Bolsos de Hombre", image: ManBags, endpoint: "/categories/man-bags" },
        { id: 3, name: "Camisetas de Mujer", image: WomanTshirts, endpoint: "/categories/woman-tshirts" },
        { id: 4, name: "Camisetas de Hombre", image: ManTshirts, endpoint: "/categories/man-tshirts" },
        { id: 5, name: "Chaquetas de Mujer", image: WomanJackets, endpoint: "/categories/woman-jackets" },
        { id: 6, name: "Chaquetas de Hombre", image: ManJackets, endpoint: "/categories/man-jackets" },
        { id: 7, name: "Zapatos de Mujer", image: WomanShoes, endpoint: "/categories/woman-shoes" },
        { id: 8, name: "Zapatos de Hombre", image: ManShoes, endpoint: "/categories/man-shoes" }
    ];

    const seasonsData = [
        { id: 1, name: "Verano", image: SummerSeason, endpoint: "/seasons/summer" },
        { id: 2, name: "Primavera", image: SpringSeason, endpoint: "/seasons/spring" },
        { id: 3, name: "Invierno", image: WinterSeason, endpoint: "/seasons/winter" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setOffset((prevOffset) => (prevOffset >= 100 ? 0 : prevOffset + 100 / categoriesData.length));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const offsetY = window.scrollY;
            const newScale = 1 + (offsetY > 100 ? (offsetY - 100) / 7000 : 0);
            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const renderCategories = (data) => (
        data.map((category) => (
            <NavLink
                to={`/products?category=${category.name}`} // Cambié a usar query params para categoría
                key={category.id}
                className={({ isActive }) => (isActive ? 'myCustomActiveClass' : 'myCustomClass')}
            >
                <div className="imageContainer">
                    <img
                        src={category.image}
                        alt={category.name}
                        className="itemImage"
                        loading="lazy" // Mejora el rendimiento de carga
                    />
                </div>
                <div className="itemDescription">
                    <p className='pHome'>{category.name}</p>
                </div>
            </NavLink>
        ))
    );

    const renderSeasons = (data) => (
        data.map((season) => (
            <NavLink
                to={season.endpoint}
                key={season.id}
                className="dropItem"
            >
                <div className="imageContainer">
                    <img
                        src={season.image}
                        alt={season.name}
                        className="itemImageDrops"
                        loading="lazy" // Mejora el rendimiento de carga
                    />
                </div>
                <div className="itemDescription">
                    <p>{season.name}</p>
                </div>
            </NavLink>
        ))
    );

    return (
        <main>
            <section className="videoScrollContainer">
                <div className="videoWrapper">
                    <img
                        className="scrollImage"
                        style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease' }}
                        src={winterImage}
                        alt="Imagen de fondo"
                        loading="lazy" // Mejora el rendimiento de carga
                    />
                </div>
            </section>

            <section className="newCollections">
                <h1 className='h1Style'>Echa un vistazo a los nuevos drops</h1>
                <div className="newDropsHome">
                    {renderCategories(categoriesData)}
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
                                onError={() => console.error('Error al cargar el video')} // Manejo de error
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
                        {categoriesData.map((category) => (
                            <NavLink
                                to={`/products?category=${category.name}`} // Cambié a usar query params para categoría
                                key={category.id}
                                className="carouselItem"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="carouselImage"
                                    loading="lazy" // Mejora el rendimiento de carga
                                />
                                <p>{category.name}</p>
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
                            src={AutumnImage}
                            alt="Imagen de otoño" 
                            loading="lazy" // Mejora el rendimiento de carga
                        />
                    </NavLink>
                </div>
            </section>

            <section className="newCollections lastSection">
                <h1 className='h1Style'>Echa un vistazo a las nuevas temporadas</h1>
                <div className="newDropsHome2">
                    {renderSeasons(seasonsData)}
                </div>
            </section>
        </main>
    );
};

export default HomePage;
