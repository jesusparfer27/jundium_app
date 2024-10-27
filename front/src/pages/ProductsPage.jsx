import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../css/pages/product_page.css';

import AutumnImage from '../assets/home-sections/autumn-session-home.jpg';
import SpringImage from '../assets/season-images-product_page/example-spring-season.jpg';
import SummerImage from '../assets/season-images-product_page/example-summer-season.jpg';
import WinterImage from '../assets/home-sections/winter-session-home.jpg';

export const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT, VITE_IMAGES_BASE_URL } = import.meta.env;

    // Obtener los parámetros de la URL
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    const genderParam = searchParams.get('gender');
    const collectionParam = searchParams.get('collection');

    const fetchProducts = async () => {
        setLoading(true); // Iniciar el loading
        setError(null);   // Reiniciar el error

        try {
            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}`);
            if (!response.ok) throw new Error('Error al cargar los productos');
            const data = await response.json();

            // Filtrar los productos según los parámetros de tipo, género y colección
            const filteredProducts = data.filter(product =>
                (!typeParam || product.type === typeParam) &&
                (!genderParam || product.gender === genderParam) &&
                (!collectionParam || product.collection === collectionParam)
            );

            setProducts(filteredProducts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Finalizar el loading
        }
    };

    useEffect(() => {
        // Verificar si las variables de entorno están definidas
        if (!VITE_API_BACKEND || !VITE_PRODUCTS_ENDPOINT || !VITE_IMAGES_BASE_URL) {
            setError("Error: Variables de entorno no configuradas correctamente.");
            setLoading(false);
            return;
        }

        fetchProducts();
    }, [typeParam, genderParam, collectionParam]); // Ejecuta fetchProducts cuando cambien los parámetros

    if (loading) return <div className="loading">Cargando productos...</div>;
    if (error) return <div className="error">Error al cargar productos: {error}</div>;

    return (
        <>
            <div className='imageProducts_Container'>
                <div className="container_ImageEffect">
                    <img src={WinterImage} alt="" />
                </div>
            </div>
            <section className="productsPage">
                <div className="heroSection">
                    <div className="heroImage">
                        {/* Puedes agregar aquí un contenido adicional para la sección hero si lo deseas */}
                    </div>
                </div>
                <div className="productsContainer">
                    <div className="productGrid">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <NavLink
                                    to={`/products/${product._id}`}
                                    key={product._id} // Usar _id como clave única
                                    className="productItem_ProductPage"
                                >
                                    <div className="productImageWrapper">
                                        <img
                                            src={
                                                product.variants &&
                                                product.variants[0] &&
                                                product.variants[0].image
                                                    ? `${VITE_IMAGES_BASE_URL}${product.variants[0].image.find(img => img.endsWith('.jpg') || img.endsWith('.png')) || product.variants[0].image[0]}`
                                                    : "ruta/a/imagen/por/defecto.jpg" // Imagen por defecto si no hay imágenes disponibles
                                            }
                                            alt={product.name || 'Producto sin nombre'}
                                            className="productImage"
                                        />
                                        <div className="likeIcon">
                                            <span className="material-symbols-outlined">favorite</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4>{product.name || 'Nombre no disponible'}</h4>
                                        <p>${(product.base_price - product.discount).toFixed(2) || 'Precio no disponible'}</p>
                                    </div>
                                </NavLink>
                            ))
                        ) : (
                            <p>No se encontraron productos.</p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductsPage;
