import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/pages/showing_product_page.css';

export const ShowingProductPage = () => {
    const { id } = useParams(); // Obtener el id del producto de la URL

    // Simulación de un producto
    const product = {
        id: id,
        name: `Producto ${id}`,
        price: `$${id * 10}`,
        description: 'Descripción del producto.',
        images: [
            'https://via.placeholder.com/300', // Imagen 1
            'https://via.placeholder.com/300', // Imagen 2
            'https://via.placeholder.com/300', // Imagen 3
            'https://via.placeholder.com/300', // Imagen 4
        ],
    };

    const [accordionOpen, setAccordionOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    const toggleAccordion = () => {
        setAccordionOpen(!accordionOpen);
    };

    const handleScroll = () => {
        // Cambia el estado si el scroll es mayor de 1000px
        if (window.scrollY > 1000) {
            setIsFixed(false); // Dejar de ser fijo
        } else {
            setIsFixed(true); // Mantenerse fijo
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className="productSection">
            <div className="imageContainer">
                {product.images.map((image, index) => (
                    <div key={index} className="productImage">
                        <img src={image} alt={`${product.name} - ${index + 1}`} />
                    </div>
                ))}
            </div>
            <div className={`infoProduct ${isFixed ? 'fixed' : ''}`}>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Precio: {product.price}</p>

                <button onClick={toggleAccordion} className="accordion">
                    {accordionOpen ? 'Ocultar materiales' : 'Mostrar materiales'}
                </button>
                {accordionOpen && (
                    <div className="accordionContent">
                        <p>Materiales del producto: Algodón, poliéster.</p>
                    </div>
                )}

                <label htmlFor="size">Tamaño:</label>
                <select id="size">
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                </select>

                <label htmlFor="color">Color:</label>
                <select id="color">
                    <option value="rojo">Rojo</option>
                    <option value="azul">Azul</option>
                    <option value="verde">Verde</option>
                </select>

                <button className="addToCart">Añadir al carrito</button>
            </div>
        </section>
    );
};
