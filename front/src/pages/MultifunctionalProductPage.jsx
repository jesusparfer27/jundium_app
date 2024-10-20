import React, { useState } from 'react';
import '../css/pages/multifunctional_product_page.css';
import { useNavigate } from 'react-router-dom';
import imageFavourite from '../assets/photos/pexels-kaip-996329.jpg'

export const MultifunctionalProductPage = () => {
    const [likedProducts, setLikedProducts] = useState([
        { id: 1, name: 'Producto 1', imageUrl: '/images/product1.jpg', price: 100 },
        { id: 2, name: 'Producto 2', imageUrl: '/images/product2.jpg', price: 150 },
        { id: 3, name: 'Producto 3', imageUrl: '/images/product3.jpg', price: 200 },
        { id: 4, name: 'Producto 4', imageUrl: '/images/product4.jpg', price: 250 },
        { id: 5, name: 'Producto 5', imageUrl: '/images/product5.jpg', price: 300 },
    ]);

    const navigate = useNavigate();

    const removeProduct = (productId) => {
        setLikedProducts(likedProducts.filter(product => product.id !== productId));
    };

    const addToCart = (productId) => {
        navigate(`/cart/${productId}`);
    };

    return (
        <section className="wishlistSection">
            <h2 className="wishlistTitle">Wish List</h2>
            <div className="wishlistContainer">
                {likedProducts.map(product => (
                    <div key={product.id} className="wishlistItem">
                        <div className="imageContainer">
                            <img src={imageFavourite} alt={product.name} className="productImage" />
                        </div>

                        <div className="detailsContainer">
                            <div className="detailsContainerFather">
                                <div className="removeButtonContainer">
                                    <button
                                        className="removeButton"
                                        onClick={() => removeProduct(product.id)}
                                    >
                                        X
                                    </button>
                                </div>
                                <div className="productInfoRow">
                                    <div className="productInfoColumn">
                                        <div className="productName">{product.name}</div>
                                        <div className="productPrice">${product.price}</div>
                                    </div>
                                    <div className="addToCartButtonContainer">
                                        <button
                                            className="addToCartButton"
                                            onClick={() => addToCart(product.id)}
                                        >
                                            Añadir al carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
