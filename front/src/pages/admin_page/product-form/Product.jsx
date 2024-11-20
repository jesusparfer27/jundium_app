import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import '../../../css/pages/admin.css'

export const Product = () => {
    const [generalProduct, setGeneralProduct] = useState({
        collection: "",
        brand: "",
        type: "",
        gender: "",
        new_arrival: true,
        featured: false,
    });
    const navigate = useNavigate();
    const VITE_API_BACKEND = import.meta.env.VITE_API_BACKEND;

    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log(`Cambiando ${id}: ${value}`);
        setGeneralProduct((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setGeneralProduct((prev) => ({ ...prev, new_arrival: false }));
        }, 7 * 24 * 60 * 60 * 1000);

        return () => clearTimeout(timer);
    }, []);

    const validateProductData = () => {
        if (!generalProduct.collection || !generalProduct.brand || !generalProduct.type || !generalProduct.gender) {
            console.error("Datos incompletos: Faltan algunos campos.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateProductData()) return;

        const formData = new FormData();
        
        Object.keys(generalProduct).forEach((key) => {
            formData.append(key, generalProduct[key]);
        });


        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${VITE_API_BACKEND}/create-product`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear el producto.");
            }

            const data = await response.json();
            console.log("Producto creado con éxito:", data);

            navigate("/admin");
        } catch (err) {
            console.error("Error en la creación del producto:", err);
        }
    };

    return (
        <div className="createProductContainer">
            <div className="createProduct">
                <form onSubmit={handleSubmit}>
                    <div className="containerTittle_AdminContainer_Create">
                        <div className="containerTittle_AdminCreate">
                            <h1>Create a product</h1>
                        </div>
                    </div>
                    <div className="productForm">
                        <div className="divForm_ColumnContainer">
                            <div className="divForm_Column">
                                <label htmlFor="gender" className="labelTypeOfProduct">Gender</label>
                                <select
                                    id="gender"
                                    value={generalProduct.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="mujer">Mujer</option>
                                    <option value="hombre">Hombre</option>
                                    <option value="unisex">Unisex</option>
                                </select>
                            </div>

                            <div className="divForm_Column">
                                <label htmlFor="brand" className="labelTypeOfProduct">Brand</label>
                                <input
                                    type="text"
                                    id="brand"
                                    className="inputTypeOfProduct"
                                    placeholder="EXAMPLE: Nike"
                                    value={generalProduct.brand}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="divForm_Column">
                                <label htmlFor="collection" className="labelTypeOfProduct">Collection</label>
                                <input
                                    type="text"
                                    id="collection"
                                    className="inputTypeOfProduct"
                                    placeholder="EXAMPLE: Spring 2024"
                                    value={generalProduct.collection}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="divForm_Column">
                                <label htmlFor="type" className="labelTypeOfProduct">Tipo de Producto</label>
                                <select
                                    id="type"
                                    value={generalProduct.type}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Type</option>
                                    <option value="camiseta">Camiseta</option>
                                    <option value="abrigo">Abrigo</option>
                                    <option value="zapatillas">Zapatillas</option>
                                    <option value="bolso">Bolso</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
