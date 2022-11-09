import { useRouteError, useLocation, Link } from 'react-router-dom'
import '../assets/ErrorPage.css'

const getMessageError = (error) => {
    const alternativeRoute = `mocked${useLocation().pathname}`

    if (error.message === 'Failed to fetch')
        return (
            <div className="err">
                <div>
                    The data could not be retrieved from the remote server. The
                    remote server is probably not running.
                </div>
                <div>
                    You can try to run the application &nbsp;
                    <Link to={alternativeRoute}>with local mocked-data</Link>
                </div>
            </div>
        )
    if (error.status === 404)
        return (
            <div className="err">
                Page non trouvée. Les seules chemins possibles sont{' '}
                <Link to="/12">/12</Link> et <Link to="/18">/18</Link> ou encore
                &nbsp;
                <Link to="/mocked/12">/mocked/12</Link> et{' '}
                <Link to="/mocked/18">/mocked/18</Link>
            </div>
        )
}
/** This component is the error page displayed when an error has occurred in a route or when retrieving a non-existent user*/
const ErrorPage = () => {
    const error = useRouteError()
    return getMessageError(error)
}

export default ErrorPage
