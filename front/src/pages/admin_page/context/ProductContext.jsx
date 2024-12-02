import { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [generalProduct, setGeneralProduct] = useState({
        collection: "",
        brand: "",
        type: "",
        gender: "",
        new_arrival: true,
        featured: false,
    });

    const [variants, setVariants] = useState([{
        name: '',
        color: { colorName: '', hexCode: '' },
        size: [],
        file: [],
        material: '',
        base_price: '',
        discount: 0,
        image: [],
        is_main: false,
        description: '',
    }]);

    return (
        <ProductContext.Provider value={{ generalProduct, setGeneralProduct, variants, setVariants }}>
            {children}
        </ProductContext.Provider>
    );
};