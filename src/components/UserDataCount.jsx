import '../assets/UserDataCount.css'

const UserDataCount = ({ img, quant, cat }) => {
    const getColor = (cat) => {
        switch (cat) {
            case 'Calories':
                return '#ff000012'
            case 'Proteines':
                return 'rgba(74, 184, 255, 0.1)'
            case 'Glucides':
                return '#F9CE231a'
            case 'Lipides':
                return 'rgba(253, 81, 129, 0.1)'
        }
    }

    return (
        <div className="userDataCount">
            <div>
                <div style={{ backgroundColor: getColor(cat) }}>
                    <img src={img} />
                </div>
            </div>
            <div>
                <div>
                    {quant}
                    {cat === 'Calories' ? 'kCal' : 'g'}
                </div>
                <div>{cat}</div>
            </div>
        </div>
    )
}

export default UserDataCount
