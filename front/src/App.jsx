// src/App.js
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "./context/HeaderContext";
import Header from "./components/header/Header";
import './css/pages/homepage.css';
import './css/app/app.css';
import Footer from "./components/footer/Footer";
import { useContext } from "react";
import { HeaderContext } from "./context/HeaderContext";

function App() {
    return (
        <HeaderProvider>
            <Header />
            <MainContent />
            <Footer />
        </HeaderProvider>
    );
}

// Componente separado para el contenido principal
function MainContent() {
    const { overlayVisible, activeMenu } = useContext(HeaderContext);

    return (
        <>
            {/* Capa que cubre la aplicación */}
            {overlayVisible && (
                <div className={`overlay ${activeMenu ? 'active' : ''}`}></div>
            )}
            <Outlet />
        </>
    );
}

export default App;
