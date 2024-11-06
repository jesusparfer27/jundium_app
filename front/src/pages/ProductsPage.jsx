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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

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
            console.log(data)

            const filteredProducts = data.filter(product =>
                (!typeParam || product.type === typeParam) &&
                (!genderParam || product.gender === genderParam) &&
                (!collectionParam || product.collection === collectionParam)
            );

            setProducts(filteredProducts);
            console.log(filteredProducts)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUserIdFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Payload del token:', payload);
            return payload.id;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    };

    const fetchProductById = async (productId) => {
        try {
            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}/${productId}`);
            if (!response.ok) throw new Error('Error al cargar el producto');

            const productData = await response.json();

            if (productData && productData._id) {
                productData.id = productData._id; // Asigna el ID a una propiedad esperada
                productData.variants = productData.variants.map(variant => ({
                    ...variant,
                    product_id: productData.id // Asegúrate de que el ID se almacena correctamente
                }));
                
                // Establecer la primera variante como seleccionada
                if (productData.variants.length > 0) {
                    setSelectedVariant(productData.variants[0]);
                }
            }
            
            setProducts(productData);
        } catch (err) {
            console.error('Error al obtener el producto:', err);
            setErrorMessage('Error al cargar los datos del producto.');
        }
    };


    useEffect(() => {
        if (id) {
            console.log("ID del producto:", id);
            fetchProductById(id);
        }
    }, [id, VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT]);

    const handleAddToWishlist = async (productId) => {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            setErrorMessage('Por favor, inicia sesión para añadir productos a la wishlist.');
            return;
        }
    
        const userId = getUserIdFromToken(token);
        if (!userId) {
            setErrorMessage('Error al extraer información del usuario.');
            return;
        }
    
        // Asegúrate de que se haya seleccionado una variante
        const variantId = selectedVariant ? selectedVariant.variant_id : null;
    
        console.log('ID del producto:', productId);
        console.log('ID de la variante:', variantId); // Asegura que tengas el `variantId` correcto
    
        if (!variantId) {
            setErrorMessage('Por favor, selecciona una variante antes de añadir a la wishlist.');
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
                    user_id: userId,
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
    


    useEffect(() => {
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
                                            onClick={() => fetchProductById(product._id)}
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
                                            onClick={() => handleAddToWishlist(product._id)}  // Pasa el ID del producto
                                            className="likeIcon"
                                        >
                                            Añadir a Wishlist
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
