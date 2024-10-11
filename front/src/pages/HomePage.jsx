import SeasonVideo from '../assets/1321208-uhd_3840_2160_30fps.mp4'; // Importa el video correctamente
import { NavLink } from 'react-router-dom'; // Para futuras rutas
import '../css/pages/homepage.css'; // Asegúrate de tener un archivo CSS

export const HomePage = () => {

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
                            to={`/product/${product.id}`} // Ruta futura
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
                    {/* NavLink con el video y el efecto CSS */}
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
        </main>
    );
};
