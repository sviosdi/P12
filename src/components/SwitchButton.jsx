import React from 'react'
import '../assets/SwitchButton.css'
import { Navigate, useNavigate } from 'react-router-dom'

const SwitchButton = () => {
    const [checked, setChecked] = React.useState(false)
    const Navigate = useNavigate()
    const handleChange = (ev) => {
        // console.log('changing user...')
        Navigate(`/${checked ? '12' : '18'}`)
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
