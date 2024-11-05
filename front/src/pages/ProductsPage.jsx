import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../css/pages/product_page.css';
import { useParams } from 'react-router-dom';

import AutumnImage from '../assets/home-sections/autumn-session-home.jpg';
import SpringImage from '../assets/season-images-product_page/example-spring-season.jpg';
import SummerImage from '../assets/season-images-product_page/example-summer-season.jpg';
import WinterImage from '../assets/home-sections/winter-session-home.jpg';

export const ProductsPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT, VITE_IMAGES_BASE_URL } = import.meta.env;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    const genderParam = searchParams.get('gender');
    const collectionParam = searchParams.get('collection');

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}`);
            if (!response.ok) throw new Error('Error al cargar los productos');
            const data = await response.json();

            const filteredProducts = data.filter(product =>
                (!typeParam || product.type === typeParam) &&
                (!genderParam || product.gender === genderParam) &&
                (!collectionParam || product.collection === collectionParam)
            );

            setProducts(filteredProducts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };




    const handleAddToWishlist = async (product_id, variant_id) => {
        if (!product_id || !variant_id) {
            console.error("productId y variantId son requeridos.");
            return;
        }

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error("Usuario no autenticado. No se puede agregar a la wishlist.");
            return;
        }

        const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
        const user_id = decodedToken.id;

        if (!user_id) {
            console.error("No se pudo obtener el user_id del token.");
            return;
        }

        // Buscar el producto
        const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}/${product_id}`);
        if (!response.ok) {
            console.error('Error al buscar el producto');
            return;
        }
        const product = await response.json();

        console.log('Producto:', product);
        console.log('ID de variante:', variant_id);

        // Buscar la variante con un manejo más claro de tipos
        const variant = product.variants.find(
            (v) => v._id.toString() === variant_id.toString()
        );

        console.log('Variantes del producto:', product.variants);
        console.log("la variante seleccionada:", variant_id);

        if (!variant) {
            console.error('Variante no encontrada');
            return;
        }

        const wishlistData = { user_id, product_id, variant_id };

        try {
            const responseWishlist = await fetch(`${VITE_API_BACKEND}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(wishlistData),
            });

            if (!responseWishlist.ok) {
                const errorData = await responseWishlist.text();
                throw new Error(errorData || 'Error al agregar a la wishlist');
            }

            const responseData = await responseWishlist.json();
            console.log('Producto agregado a la wishlist', responseData);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        if (!VITE_API_BACKEND || !VITE_PRODUCTS_ENDPOINT || !VITE_IMAGES_BASE_URL) {
            setError("Error: Variables de entorno no configuradas correctamente.");
            setLoading(false);
            return;
        }

        fetchProducts();
    }, [typeParam, genderParam, collectionParam]);

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
                    <div className="heroImage"></div>
                </div>
                <div className="productsContainer">
                    <div className="productGrid">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="productItemWrapper">
                                    <div className="productImageWrapper">
                                        <NavLink
                                            to={`/products/${product._id}`}
                                            className="productItem_ProductPage"
                                        >
                                            <img
                                                src={
                                                    product.variants &&
                                                        product.variants[0] &&
                                                        product.variants[0].image
                                                        ? `${VITE_IMAGES_BASE_URL}${product.variants[0].image.find(img => img.endsWith('.jpg') || img.endsWith('.png')) || product.variants[0].image[0]}`
                                                        : "ruta/a/imagen/por/defecto.jpg"
                                                }
                                                alt={product.name || 'Producto sin nombre'}
                                                className="productImage"
                                            />
                                        </NavLink>
                                        <button
                                            className="likeIcon"
                                            onClick={() => handleAddToWishlist(product._id, product.variants[0]._id)} // Cambia aquí si la variante seleccionada es distinta
                                        >
                                            <span className="material-symbols-outlined">favorite</span>
                                        </button>

                                    </div>
                                    <div>
                                        <h4>{product.name || 'Nombre no disponible'}</h4>
                                        <p>${(product.base_price - product.discount).toFixed(2) || 'Precio no disponible'}</p>
                                    </div>
                                </div>
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
