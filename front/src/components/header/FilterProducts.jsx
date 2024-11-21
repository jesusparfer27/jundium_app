import '../../css/components/header/filter.css';
import { HeaderContext } from '../../context/HeaderContext';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const FilterProducts = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const filterContainerRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT } = import.meta.env;

    const [filters, setFilters] = useState({
        size: [],
        color: [], // Filtro de color
        collection: [],
        priceRange: [0, 100],
        type: [],
        gender: []
    });

    const [openAccordions, setOpenAccordions] = useState({
        size: false,
        color: false, // Acordeón de color
        collection: false,
        price: false,
        type: false,
        gender: false
    });

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedFilters = JSON.parse(localStorage.getItem('filters'));
        if (storedFilters) {
            setFilters(storedFilters);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]);

    const fetchProductTypes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}`);
            if (!response.ok) throw new Error('Error al cargar tipos de productos');
            const data = await response.json();
            const uniqueTypes = Array.from(new Set(data.map(product => product.type)));
            setProductTypes(uniqueTypes.map((type, index) => ({ id: index, type })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductTypes();
    }, []);

    const fetchFilteredProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters.size.length) queryParams.append('size', filters.size.join(','));
            if (filters.color.length) queryParams.append('color', filters.color.join(',')); // Filtro de color
            if (filters.collection.length) queryParams.append('collection', filters.collection.join(','));
            if (filters.type.length) queryParams.append('type', filters.type.join(','));
            if (filters.gender.length) queryParams.append('gender', filters.gender.join(','));
            if (filters.priceRange.length) {
                queryParams.append('minPrice', filters.priceRange[0]);
                queryParams.append('maxPrice', filters.priceRange[1]);
            }

            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Error al cargar los productos');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleAccordion = (category) => {
        setOpenAccordions(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleFilterChange = (category, value) => {
        setFilters(prev => {
            const currentFilters = prev[category];
            if (currentFilters.includes(value)) {
                return { ...prev, [category]: currentFilters.filter(v => v !== value) };
            } else {
                return { ...prev, [category]: [...currentFilters, value] };
            }
        });
    };

    const handleSizeChange = (size) => {
        handleFilterChange('size', size);
    };

    const handleColorChange = (color) => {
        handleFilterChange('color', color);
    };

    const handleSubmit = () => {
        const queryParams = new URLSearchParams();
        if (filters.size.length) queryParams.append('size', filters.size.join(','));
        if (filters.color.length) queryParams.append('color', filters.color.join(',')); // Filtro de color
        if (filters.collection.length) queryParams.append('collection', filters.collection.join(','));
        if (filters.type.length) queryParams.append('type', filters.type.join(','));
        if (filters.gender.length) queryParams.append('gender', filters.gender.join(','));
        if (filters.priceRange.length) {
            queryParams.append('minPrice', filters.priceRange[0]);
            queryParams.append('maxPrice', filters.priceRange[1]);
        }

        if (location.pathname === '/products') {
            navigate(`/products?${queryParams.toString()}`);
            closeMenu();
        }
    };

    return (
        <div
            ref={filterContainerRef}
            className={`filterContainer ${activeMenu === 'filter' ? 'active slideInHorizontalRightToLeft' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Mostrar Filtros</h2>
            <div className="filtersSection">
                {/* Filtro por Tamaño */}
                <div className="filterAccordion">
                    <div className="filterHeader" onClick={() => toggleAccordion('size')}>
                        <span>Por Tamaño</span>
                        <span className="material-symbols-outlined">
                            {openAccordions.size ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                    </div>
                    {openAccordions.size && (
                        <div className="filterContent">
                            <div className='checkboxes'>
                                {['XS', 'S', 'M', 'L', 'XL', 'Única'].map((size, index) => (
                                    <label className="custom-label" key={index}>
                                        <input 
                                            type="checkbox" 
                                            checked={filters.size.includes(size)} 
                                            onChange={() => handleSizeChange(size)} 
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Filtro por Color */}
                <div className="filterAccordion">
                    <div className="filterHeader" onClick={() => toggleAccordion('color')}>
                        <span>Por Color</span>
                        <span className="material-symbols-outlined">
                            {openAccordions.color ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                    </div>
                    {openAccordions.color && (
                        <div className="filterContent">
                            <div className='checkboxes'>
                                {['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco'].map((color, index) => (
                                    <label className="custom-label" key={index}>
                                        <input 
                                            type="checkbox" 
                                            checked={filters.color.includes(color)} 
                                            onChange={() => handleColorChange(color)} 
                                        />
                                        {color}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button className="applyFilterButton" onClick={handleSubmit}>
                Aplicar filtros
            </button>
        </div>
    );
};
