import React, { useState, useEffect } from 'react';
import '../css/pages/multifunctional_product_page.css';
import { useNavigate } from 'react-router-dom';

export const MultifunctionalProductPage = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL } = import.meta.env;

    useEffect(() => {
        const fetchLikedProducts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                const response = await fetch(`${VITE_API_BACKEND}/wishlist`, { headers });
                if (!response.ok) {
                    throw new Error('Error al obtener los productos de la wishlist');
                }

                const data = await response.json();
                console.log('Data received from wishlist API:', data); // Log de la respuesta
                if (data && data.items && Array.isArray(data.items)) {
                    setLikedProducts(data.items);
                } else {
                    throw new Error('No se encontraron productos en la wishlist');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedProducts();
    }, []);

    const handleRemoveFromWishlist = async (productId, variantId) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('Por favor, inicia sesión para eliminar productos de la wishlist.');
            return;
        }

        if (!productId || !variantId) {
            console.error('Falta productId o variantId:', { productId, variantId });
            setError('No se pudo eliminar de la wishlist debido a un problema con los datos del producto.');
            return;
        }

        try {
            const response = await fetch(`${VITE_API_BACKEND}/wishlist/${productId}/${variantId}`, {
                method: 'DELETE',  // Usamos DELETE para eliminar
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
                throw new Error(errorData.message || 'Error al eliminar de la wishlist');
            }

            const data = await response.json();
            console.log('Producto eliminado de la wishlist:', data);

            // Actualizamos el estado local para eliminar el producto de la wishlist
            setLikedProducts((prevProducts) => prevProducts.filter(item => item.variant_id !== variantId));
        } catch (error) {
            console.error('Error al eliminar de la wishlist:', error);
            setError('Ocurrió un error al eliminar el producto de la wishlist.');
        }
    };

    const addToCart = (productId, variantId) => {
        // Navega a la ruta con los parámetros del producto y variante
        navigate(`/products/${productId}?variant_id=${variantId}`);
    };
    

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className="wishlistSection">
            <h2 className="wishlistTitle">Wish List</h2>
            <div className="wishlistContainer">
                {likedProducts.length > 0 ? (
                    likedProducts.map(item => {
                        const { product_id, variant_id } = item;
                        const { name, base_price, variants } = product_id;

                        // Buscar la variante correspondiente al variant_id
                        const variant = variants?.find(v => v.variant_id === variant_id); // Buscar variante por variant_id
                        const imageUrl = variant?.image?.[0]; // Acceder a la primera imagen de la variante

                        // Debug: Verificar qué imagen estamos obteniendo
                        console.log('Image URL:', imageUrl);
                        const fullImageUrl = imageUrl ? `${VITE_IMAGES_BASE_URL}${imageUrl}` : null;
                        console.log('Full Image URL:', fullImageUrl); // Log de la URL completa de la imagen

                        return (
                            <div key={variant_id} className="wishlistItem">
                                <div className="imageContainer">
                                    {fullImageUrl ? (
                                        <img src={fullImageUrl} alt={name} />
                                    ) : (
                                        <p>Imagen no disponible</p>
                                    )}
                                </div>

                                <div className="detailsContainer">
                                    <div className="removeItem_Wishlist">
                                        <button className='removeItem_WishlistButton' onClick={() => handleRemoveFromWishlist(product_id._id, variant_id)}>
                                            <span className="material-symbols-outlined">
                                                close
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="productInfoRow">
                                    <div className="productInfoColumn">
                                        <div className="productName">{name}</div>
                                        <div className="productPrice">${base_price}</div>
                                    </div>
                                    <div className="addToCartButtonContainer">
                                        <button className="addToCartButton" onClick={() => addToCart(product_id._id, variant_id)}>
                                            <div className="spanLink_Container">
                                                <span className="material-symbols-outlined">
                                                    visibility
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div>No tienes productos en tu wishlist.</div>
                )}

            </div>
        </section>
    );
};

export default MultifunctionalProductPage;
