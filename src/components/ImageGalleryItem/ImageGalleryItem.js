import PropTypes from 'prop-types';
import ImageGaleryStyle from './ImageGalleryItem.module.css'
import ImageGalleryItemImage from './ImageGalleryItem.module.css'



export default function ImageGalleryItem({ item, onClick }) { 
    return (
        <li className={ImageGaleryStyle.ImageGalleryItem} onClick={() => onClick(item) }> 
            <img className={ImageGalleryItemImage.ImageGalleryItemImage} src={item.webformatURL} alt="" />
        </li>
    )
}

ImageGalleryItem.propTypes = {
    item: PropTypes.object,
    onClick: PropTypes.func
} 