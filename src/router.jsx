import React from 'react'
import ReactDOM from 'react-dom/client'
import Homepage from './pages/Homepage'
import './index.css'
import ErrorPage from './pages/ErrorPage'
import {
    getUserData,
    getUserActivity,
    getTimes,
    getPerformances,
} from './utils/fetchdata'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        loader: async () => {
            throw new Response('page not found', {
                status: 404,
            })
        },
        element: null,
        errorElement: <ErrorPage />,
    },
    {
        path: '/:id',
        loader: async ({ params }) => {
            const user = await getUserData(params.id)
            const activities = await getUserActivity(params.id)
            const times = await getTimes(params.id)
            const perf = await getPerformances(params.id)

            console.log(user)
            console.log(activities)
            console.log(times)
            console.log(perf)

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
])

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode> // Désactiver le mode strict en développement pour éviter la répétition des méthodes construtor(), render(), shouldComponentUpdate()
    <RouterProvider router={router} />
    // </React.StrictMode>
)
