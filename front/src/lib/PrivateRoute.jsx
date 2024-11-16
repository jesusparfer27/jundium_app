// PrivateRoute.js
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ element, isAuthenticated }) => {
    return isAuthenticated ? element : <Navigate to="/email-validation" replace />;
};

export default PrivateRoute;
