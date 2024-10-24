import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/pages/product_page.css';

// Componente para mostrar la tarjeta de cada producto
const ProductCard = ({ product }) => (
    <div className="productCard">
        <h3>{product.nombre}</h3>
        <p>{product.descripcion}</p>
        <span>Precio: ${product.precio}</span>
        <button>Añadir al carrito</button>
    </div>
);

const ProductsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category') || 'General'; // Proporcionar un valor por defecto
    const subCategory = queryParams.get('subCategory') || 'General'; // Proporcionar un valor por defecto

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT } = import.meta.env;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}?category=${category}&subCategory=${subCategory}`);
                
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, subCategory]);

    if (loading) return <div className="loading">Cargando productos...</div>;
    if (error) return <div className="error">Error al cargar productos: {error}</div>;

    return (
        <section className="productsPage">
            <h2 className="productsPageTitle">{`Mostrando productos de: ${category} - ${subCategory}`}</h2>
            <div className="productsContainer">
                {products.length > 0 ? (
                    products.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div className="noProducts">No se encontraron productos.</div>
                )}
            </div>
        </section>
    );
};

export default ProductsPage;
