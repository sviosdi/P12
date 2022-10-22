import '../assets/Sidebar.css'
import yoga from '../assets/img/yoga.svg'
import natation from '../assets/img/natation.svg'
import velo from '../assets/img/velo.svg'
import poids from '../assets/img/poids.svg'
import { Link } from 'react-router-dom'
import SwitchButton from './SwitchButton'

const MenuButton = ({ img, alt }) => {
    return (
        <Link>
            <img src={img} alt={alt} />
        </Link>
    )
}

const Sidebar = () => {
    return (
        <div className="sidebar">
            <SwitchButton />
            <div className="sidebar-buttons">
                <MenuButton img={yoga} alt="yoga" />
                <MenuButton img={natation} alt="natation" />
                <MenuButton img={velo} alt="velo" />
                <MenuButton img={poids} alt="poids" />
            </div>
            <div>
                <div className="copyright">Copyright, SportSee 2022</div>
            </div>
        </div>
    )
}

export default Sidebar
