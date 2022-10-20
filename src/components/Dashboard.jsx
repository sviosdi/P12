import {
    USER_ACTIVITY,
    USER_MAIN_DATA,
    USER_AVERAGE_SESSIONS,
    USER_PERFORMANCE,
} from '../data/data'
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
    const user = USER_MAIN_DATA[1]
    const activities = USER_ACTIVITY[1].sessions
    const userDataCount = USER_MAIN_DATA[1].keyData
    const score = USER_MAIN_DATA[0].score
    const times = USER_AVERAGE_SESSIONS[0].sessions
    const performances = USER_PERFORMANCE[0].data

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
                        <RadarChart data={performances} />
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
