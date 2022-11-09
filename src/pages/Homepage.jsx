import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard'
import '../assets/Homepage.css'

/** This component is the main page. It includes the Navbar, Sidebar and Dashboard */
const Homepage = () => {
    return (
        <>
            <Navbar />
            <main>
                <Sidebar />
                <Dashboard />
            </main>
        </>
    )
}

export default Homepage
