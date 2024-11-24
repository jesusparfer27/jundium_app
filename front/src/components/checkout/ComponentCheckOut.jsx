import React, { useContext } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/checkout/checkout_component.css';

export const Modal = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);

    const renderContent = () => {
        switch (activeMenu) {
            case 'modalInfo_CheckOut_pedido':
                return <div className="sectionContent">Información sobre el pedido...</div>;
            case 'modalInfo_CheckOut_envio':
                return <div className="sectionContent">Detalles sobre el envío...</div>;
            case 'modalInfo_CheckOut_devolucion':
                return <div className="sectionContent">Política de devoluciones...</div>;
            case 'modalInfo_CheckOut_atencion':
                return <div className="sectionContent">Contacta con Atención al Cliente...</div>;
            default:
                return <div className="sectionContent">Selecciona una opción para más información.</div>;
        }
    };

    return (
        <>
            <div
                className={`checkoutContainer_slide ${activeMenu?.startsWith('modalInfo_CheckOut') ? 'active' : ''
                    }`}
            >
                <div className="mainContainer_renderContent">
                    <div className="containerButton_renderContent">
                        <button className="closeButton" onClick={closeMenu}>
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>
                    <div className="container_renderContent">
                        <div className='renderContent'>{renderContent()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};
