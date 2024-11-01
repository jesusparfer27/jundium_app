import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/pages/showing_product_page.css';

export const ShowingProductPage = () => {
    const { id } = useParams(); // Obtener el id del producto de la URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null); // Estado para la variante seleccionada

    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL, VITE_PRODUCTS_ENDPOINT } = import.meta.env;

    const toggleAccordion = () => {
        setAccordionOpen(!accordionOpen);
    };

    const handleColorChange = (e) => {
        const selectedColor = e.target.value;
        const variant = product.variants.find(
            (variant) => variant.color.colorName === selectedColor
        );
        setSelectedVariant(variant);
    };

    useEffect(() => {
        const fetchProductById = async (productId) => {
            try {
                const token = localStorage.getItem('authToken'); // O la forma en que estás almacenando tu token
                const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}/${productId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(token)

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const productData = await response.json();
                setProduct(productData);
                setLoading(false); // Cambiar el estado de carga a falso después de obtener los datos
            } catch (error) {
                console.error('Error al obtener el producto:', error);
                setLoading(false); // Asegúrate de cambiar el estado de carga a falso en caso de error
            }
        };

        if (id) { // Asegúrate de que id no sea undefined
            fetchProductById(id); // Pasar el id correcto a la función
        }
    }, [id]);

    if (loading) return <div>Cargando producto...</div>;
    if (!product) return <div>Producto no encontrado.</div>;

    return (
        <section className="productSection">
            <div className="imageContainer">
                {selectedVariant && selectedVariant.image.length > 0 ? (
                    selectedVariant.image
                        .filter((imgUrl) => !imgUrl.includes('show'))
                        .map((imgUrl, imgIndex) => (
                            <div key={imgIndex} className="productImage_ShowingPage">
                                <img
                                    src={`${VITE_IMAGES_BASE_URL}${imgUrl}`}
                                    alt={`${product.name} - ${selectedVariant.color.colorName}`}
                                    className="productImage"
                                    onError={(e) => (e.target.src = 'ruta/a/imagen/por/defecto.jpg')}
                                />
                            </div>
                        ))
                ) : (
                    <div className="productImage">
                        <img src="ruta/a/imagen/por/defecto.jpg" alt="Imagen por defecto" />
                    </div>
                )}
            </div>
            <div className="infoProduct_Container">
                <div className="infoProduct_ShowingProduct">
                    <div className="infoProduct_Row">
                        <h2 className='h2_ShowingPage'>{product.name}</h2>
                        <p className='paraphHidden_Accordion'>{selectedVariant ? selectedVariant.material : product.description}</p>
                        <p>Precio: {selectedVariant ? selectedVariant.price : product.base_price}</p>

                        <button onClick={toggleAccordion} className="accordion">
                            {accordionOpen ? 'Ocultar materiales' : 'Mostrar materiales'}
                        </button>
                        {accordionOpen && (
                            <div className="accordionContent">
                                <p>Materiales del producto: {selectedVariant?.material}</p>
                            </div>
                        )}

                        <br />
                        <label htmlFor="size" className="label_Size">Tamaño:</label>
                        <select id="size" className="select_Size">
                            {selectedVariant &&
                                selectedVariant.size.map((size, index) => (
                                    <option key={index} value={size} className="option_Size">
                                        {size}
                                    </option>
                                ))}
                        </select>

                        <label htmlFor="color" className="label_Color">Color:</label>
                        <select id="color" className="select_Color" onChange={handleColorChange}>
                            {product.variants.map((variant, index) => (
                                <option key={index} value={variant.color.colorName} className="option_Color">
                                    {variant.color.colorName}
                                </option>
                            ))}
                        </select>

                        <button className="addToCart">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        </section>
    );
};
