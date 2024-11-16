import ErrorImage from '../assets/error-image/error-image.jpg'
import { NavLink } from 'react-router-dom'
import '../css/pages/error.css'

export const ErrorPage = () => {

    return (
        <>
            <section>
                <div className="container_errorPage">
                    <div className="container_errorImage">
                        <img className='errorImage_Left' src={ErrorImage} alt="" />
                    </div>
                    <div className="container_errorRedirection">
                        <div className="block_errorRedirection">
                            <h1 className='errorText_errorPage'>Ups! ¿Te has equivocado de página?</h1>
                            <h1 className='errorText_errorPage'>No te preocupes puedes volver haciendo click</h1>
                            <div className="button_errorContainer">
                            <NavLink to="/" className='buttonError'>Ir a inicio</NavLink>
                                </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}