import '../assets/Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../assets/img/logo.svg'

const Navbar = () => {
    return (
        <div className="navbar">
            <img src={logo} alt="logo" />
            <div>
                <Link>Accueil</Link>
                <Link>Profil</Link>
                <Link>Réglages</Link>
                <Link>Communauté</Link>
            </div>
        </div>
    )
}

export default Navbar
