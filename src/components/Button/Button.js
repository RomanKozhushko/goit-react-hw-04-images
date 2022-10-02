import PropTypes from 'prop-types';
import ButtonStyle from './Button.module.css'



// Створенння кнопки Для дозавантаження!
export default function Button({ loadMore }) {
    return (
        <button type="button" className={ButtonStyle.Button} onClick={loadMore}>Load more</button>
    )
}
 
Button.propTypes = {
    loadMore: PropTypes.func
}