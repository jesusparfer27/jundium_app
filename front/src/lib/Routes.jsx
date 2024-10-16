
import { createBrowserRouter } from "react-router-dom";
import App from '../App';

// Importar las páginas
import { HomePage } from "../pages/HomePage";
import { WomanCollection } from "../pages/womanItems/WomanCollection";
import { WomanBags } from "../pages/womanItems/WomanBags";
import { WomanShoes } from "../pages/womanItems/WomanShoes";
import { ManCollection } from "../pages/manItems/ManCollection";
import { ManBags } from "../pages/manItems/ManBags";
import { ManShoes } from "../pages/manItems/ManShoes";
import { ProductPage } from "../pages/ProductPage";
import { CheckOutPage } from "../pages/CheckOutPage";
import { EmailSignIn } from "../pages/EmailSignIn";
import { Profile } from "../pages/Profile";
import { SecondStepSignIn} from '../pages/SecondStepSignIn'

// Crear las rutas
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'woman-collection',
                element: <WomanCollection />
            },
            {
                path: 'woman-bags',
                element: <WomanBags />
            },
            {
                path: 'woman-shoes',
                element: <WomanShoes />
            },
            {
                path: 'man-collection',
                element: <ManCollection />
            },
            {
                path: 'man-bags',
                element: <ManBags />
            },
            {
                path: 'man-shoes',
                element: <ManShoes />
            },
            {
                path: 'product/:id', // Corregido aquí
                element: <ProductPage />
            },
            {
                path: 'check-out',
                element: <CheckOutPage/>
            },
            {
                path: 'email-validation',
                element: <EmailSignIn/>
            },
            {
                path: 'profile',
                element: <Profile/>
            },
            {
                path: 'email-validation-2',
                element: <SecondStepSignIn/>
            }
        ]
    }
]);

export default router;
