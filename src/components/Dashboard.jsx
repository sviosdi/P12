import { useLoaderData } from 'react-router-dom'
import '../assets/Dashboard.css'
import hand from '../assets/img/hand.svg'
import calo from '../assets/img/calories.svg'
import prot from '../assets/img/proteines.svg'
import gluc from '../assets/img/glucides.svg'
import lipi from '../assets/img/lipides.svg'
import UserDataCount from '../components/UserDataCount'
import ActivChart from '../components/ActivChart'
import ScoreChart from './ScoreChart'
import TimeChart from './TimeChart'
import RadarChart from './RadarChart'

const Dashboard = () => {
    const { user, activities, times, perf } = useLoaderData()
    const userDataCount = user.keyData
    const score = user.score
    const performances = perf.data
    const kind = perf.kind

    return (
        <div className="dashboard-main">
            <header>
                <div>
                    Bonjour <span>{user.userInfos.firstName}</span>
                </div>
                <div>
                    Félicitations! Vous avez explosé vos objectifs hier
                    <img src={hand} alt="Félicitations!" />
                </div>
            </header>
            <section className="main-layout">
                <div className="left-dash">
                    <ActivChart data={activities} />
                    <div className="bottom-charts">
                        <TimeChart data={times} />
                        <RadarChart data={performances} kind={kind} />
                        <ScoreChart data={score} />
                    </div>
                </div>
                <div className="right-dash">
                    <UserDataCount
                        img={calo}
                        quant={userDataCount.calorieCount}
                        cat="Calories"
                    />
                    <UserDataCount
                        img={prot}
                        quant={userDataCount.proteinCount}
                        cat="Proteines"
                    />
                    <UserDataCount
                        img={gluc}
                        quant={userDataCount.carbohydrateCount}
                        cat="Glucides"
                    />
                    <UserDataCount
                        img={lipi}
                        quant={userDataCount.lipidCount}
                        cat="Lipides"
                    />
                </div>
            </section>
        </div>
    )
}

export default Dashboard
