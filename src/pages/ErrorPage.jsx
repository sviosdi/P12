import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()
    console.log(error)

    return (
        <>
            <div className="err-status">Erreur {error.status}</div>
            <div className="err-desc">
                {error.status === 404
                    ? 'Page non trouvée. Les seules chemins possibles sont /12 et /18'
                    : error.statusText}
            </div>
        </>
    )
}

export default ErrorPage
