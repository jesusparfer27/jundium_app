import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import '../css/pages/product_page.css';

import AutumnImage from '../assets/home-sections/autumn-session-home.jpg';
import SpringImage from '../assets/season-images-product_page/example-spring-season.jpg';
import SummerImage from '../assets/season-images-product_page/example-summer-season.jpg';
import WinterImage from '../assets/home-sections/winter-session-home.jpg';

export const ProductsPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const { VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT, VITE_IMAGES_BASE_URL } = import.meta.env;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const typeParam = searchParams.get('type');
    const searchTerm = searchParams.get('search');
    const genderParam = searchParams.get('gender');
    const collectionParam = searchParams.get('collection');
    const variantIdParam = searchParams.get('variant_id');

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}`);
            if (!response.ok) throw new Error('Error al cargar los productos');
            const data = await response.json();

            // Filtra productos por tipo, género, colección
            const filteredProducts = data.filter(product => {
                // Solo filtra por género si se especifica uno
                const genderMatch = !genderParam || product.gender === genderParam;

                // Filtra por tipo, colección y búsqueda de nombre
                const typeMatch = !typeParam || product.type === typeParam;
                const collectionMatch = !collectionParam || product.collection === collectionParam;
                const nameMatch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());

                return genderMatch && typeMatch && collectionMatch && nameMatch;
            });

            // Desglosa todas las variantes de productos filtrados
            const productsWithVariants = filteredProducts.flatMap(product =>
                product.variants.map(variant => ({
                    ...product,
                    selectedVariant: variant // Agrega cada variante como un producto único en el array
                }))
            );

            setProducts(productsWithVariants);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, [searchTerm, typeParam, genderParam, collectionParam]);

    const handleVariantSelect = (productId, variantId) => {
        // Redirige a la página de detalles del producto con el variant_id como parámetro
        window.location.href = `/products/${productId}?variant_id=${variantId}`;
    };

    const handleAddToWishlist = async (productId, variantId) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            setErrorMessage('Por favor, inicia sesión para añadir productos a la wishlist.');
            return;
        }

        if (!productId || !variantId) {
            console.error('Falta productId o variantId:', { productId, variantId });
            setErrorMessage('No se pudo añadir a la wishlist debido a un problema con los datos del producto.');
            return;
        }

        try {
            const response = await fetch(`${VITE_API_BACKEND}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: productId,
                    variant_id: variantId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al añadir a la wishlist');
            }

            const data = await response.json();
            console.log('Producto añadido a la wishlist:', data);
        } catch (error) {
            console.error('Error al añadir a la wishlist:', error);
            setErrorMessage('Ocurrió un error al añadir el producto a la wishlist.');
        }
    };

    if (loading) return <div className="loading">Cargando productos...</div>;
    if (error) return <div className="error">Error al cargar productos: {error}</div>;

    return (
        <>
            <div className="imageProducts_Container">
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
                                <div key={`${product._id}-${product.selectedVariant.variant_id}`} className="productItemWrapper">
                                    <div className="productImageWrapper">
                                        {/* <div className="overlayFade"></div> */}
                                        <NavLink
                                            to={`/products/${product._id}?variant_id=${product.selectedVariant.variant_id}`}
                                            className="productItem_ProductPage"
                                        >
                                            <img
                                                src={product.selectedVariant.image
                                                    ? `${VITE_IMAGES_BASE_URL}${product.selectedVariant.image.find(img => img.endsWith('.jpg') || img.endsWith('.png')) || product.selectedVariant.image[0]}`
                                                    : "ruta/a/imagen/por/defecto.jpg"}
                                                alt={product.name || 'Producto sin nombre'}
                                                className="productImage"
                                            />
                                        </NavLink>

                                        <button
                                            onClick={() => handleAddToWishlist(product._id, product.selectedVariant.variant_id)}
                                            className="likeIcon"
                                        >
                                            <span className="material-symbols-outlined">
                                                favorite
                                            </span>
                                        </button>
                                    </div>

                                    <div className='containerInfo_productPage'>
                                        <h4 className='h4Products'>{product.name || 'Nombre no disponible'}</h4>
                                        <p className='pProducts'>${(product.base_price - product.discount).toFixed(2) || 'Precio no disponible'}</p>
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
