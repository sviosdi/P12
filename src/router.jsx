import React from 'react'
import ReactDOM from 'react-dom/client'
import Homepage from './pages/Homepage'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode> // Désactiver le mode strict en développement pour éviter la répétition des méthodes construtor(), render(), shouldComponentUpdate()
    <RouterProvider router={router} />
    // </React.StrictMode>
)
