import React from 'react'
import ReactDOM from 'react-dom/client'
import Homepage from './pages/Homepage'
import './index.css'
import ErrorPage from './pages/ErrorPage'

import { API } from './utils/backend.service'

import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        loader: async () => {
            return redirect('/12')
        },
        element: null,
        errorElement: <ErrorPage />,
    },
    {
        path: '/:id',
        loader: async ({ params }) => {
            const api = new API('http://localhost:3000')
            //const api = new API('https://bz0bje-3000.preview.csb.app')
            const user = await api.getUserData(Number.parseInt(params.id))
            const activities = await api.getUserActivity(
                Number.parseInt(params.id)
            )
            const times = await api.getTimes(Number.parseInt(params.id))
            const perf = await api.getPerformances(Number.parseInt(params.id))

            if (!user || !activities || !times || !perf)
                throw new Response('page not found', {
                    status: 404,
                    statusText:
                        'Page non trouvée : identifiant utilisateur incorrect',
                })
            else return { user, activities, times, perf }
        },
        element: <Homepage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/mocked/:id',
        loader: async ({ params }) => {
            const api = new API()
            const user = await api.getUserData(Number.parseInt(params.id))
            const activities = await api.getUserActivity(
                Number.parseInt(params.id)
            )
            const times = await api.getTimes(Number.parseInt(params.id))
            const perf = await api.getPerformances(Number.parseInt(params.id))

            return { user, activities, times, perf }
        },
        element: <Homepage />,
        errorElement: <ErrorPage />,
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    // Désactiver le mode strict en développement pour éviter la répétition des méthodes constructor(), render(), shouldComponentUpdate()
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
