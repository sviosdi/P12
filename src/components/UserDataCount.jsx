import '../assets/UserDataCount.css'
import PropTypes from 'prop-types'

/**
 * The React component displaying the users data cards
 * @function UserDataCount
 * @param { string } img The svg image passed to the component as a property to illustrate the card
 * @param { number } quant The value passed to the component as a property
 * @param { string } cat The array of objects with day and sessionlength fields passed to the component as a property
 * @return { jsx } Returns the jsx component
 */
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

UserDataCount.propTypes = {
    img: PropTypes.string.isRequired,
    quant: PropTypes.number.isRequired,
    cat: PropTypes.string.isRequired,
}

export default UserDataCount
