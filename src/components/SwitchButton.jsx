import React from 'react'
import '../assets/SwitchButton.css'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'

const SwitchButton = () => {
    const [checked, setChecked] = React.useState(false)
    const location = useLocation()
    const Navigate = useNavigate()
    const handleChange = (ev) => {
        let path = ''
        if (location.pathname === '/mocked/12') path = '/mocked/18'
        if (location.pathname === '/mocked/18') path = '/mocked/12'
        if (location.pathname === '/18') path = '/12'
        if (location.pathname === '/12') path = '/18'
        Navigate(path)
        setChecked((check) => !check)
    }

    return (
        <>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                />
                <span className="slider round" />
            </label>
        </>
    )
}

export default SwitchButton
