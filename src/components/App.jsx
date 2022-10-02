import { useState, useEffect } from 'react';
import "./styles.css";
import Searchbar from './SearchBar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';


// Оголошуємо необхідні СТЕЙТИ!!!
export function App ()  {
  const PERPAGE = 12;
  const [searchName, setSearchName] = useState("");
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentImg, setCurrentImg] = useState({});
  const [error, setError] = useState(null);
  
      
  
  // componentDidUpdate(_, prevState) {
  //   const { page, searchName } = this.state
  //   if (prevState.page !== page || prevState.searchName !== searchName) {
  //     this.doQuery(searchName, page)
  //   }
      
  //   if (prevState.gallery.length !== 0 &
  //     prevState.gallery.length < this.state.gallery.length) {
  //     window.scrollBy({
  //       top: window.innerHeight - 200,
  //       behavior: 'smooth',
  //     })
  //   }
  // }
  useEffect(() => {
    const URL = "https://pixabay.com/api/";
    const key = "29184640-266ee5361b73d654bedf55260";
    
    setIsLoading(true);
    const doFetch = (() => {
      fetch(`${URL}?q=${searchName}&page=${PERPAGE}&key=${key}&image_type=photo&orientation=horizontal&per_page=${App.PERPAGE}`)
        .then(resp => resp.json())
        .then(gallery => {
          if (gallery.hits.length === 0) {
            return Promise.reject(new Error("Unfortunately, the search did not yield results!"))
          }
        
          handleResponse(gallery);
        })
        .catch(error => setError(error))
        .finally(() => setIsLoading(false))
    });
    doFetch()
  }, [page, searchName])


  const handleResponse = (gallery) => {
    gallery.length === 0 ? setGallery(gallery.hits) : setGallery(prev => [...prev, ...gallery.hits]);
    setTotalItems(gallery.totalHits);
    setIsLoading(false);
    setError(null);
  }
  const  onSubmit = (evt) => {
    evt.preventDefault();
     setSearchName(evt.target.elements.searchName.value.trim().toLowerCase());
    setPage(1);
    setGallery([])
    evt.currentTarget.reset();
    };
    

    
  const loadMore = () => setPage(page => page + 1)

   const toggleModal = (img) => {
    setShowModal(!showModal);
    setCurrentImg(img)
  }
  const  handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) toggleModal({})
  }
  const handleEsc = (evt) => {
    if (evt.code === 'Escape') toggleModal({})
  }

  
    if (error) {
      return (
        <div>
          <Searchbar onSubmit={onSubmit} />
          <p className="error">Oops . . . !!! &#128579;<br></br> {error.message} </p>
        </div>
      )
    }
    if (!searchName) {
       return (
        <div>
          <Searchbar onSubmit={onSubmit} />
          <p className="coment">Enter a search topic!</p>
        </div>
      )
      
    }
    
    return (
      <div>
        <Searchbar onSubmit={onSubmit} />
        {isLoading && <Loader />}
        {gallery.length !== 0 &&
          <ImageGallery
            gallery={gallery}
            page={page}
            totalItems={totalItems}
            loadMore={loadMore}
            isLoading={isLoading}
            showModal={toggleModal} />
        }
        {showModal && <Modal handleOverlayClick={handleOverlayClick} onEsc={handleEsc} currentImg={currentImg} />}
   
      </div>
    );
  }




