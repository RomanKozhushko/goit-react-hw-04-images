import { Component } from 'react';
import "./styles.css";
import Searchbar from './SearchBar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';


// Оголошуємо необхідні СТЕЙТИ!!!
export class App extends Component {
  static PERPAGE = 12;
  state = {
    searchName: "",
    gallery: [],
    page: 1,
    totalItems: 0,
    isLoading: false,
    showModal: false,
    currentImg: {},
    error: null,
  }
      
  
  componentDidUpdate(_, prevState) {
    const { page, searchName } = this.state
    if (prevState.page !== page || prevState.searchName !== searchName) {
      this.doQuery(searchName, page)
    }
      
    if (prevState.gallery.length !== 0 &
      prevState.gallery.length < this.state.gallery.length) {
      window.scrollBy({
        top: window.innerHeight - 200,
        behavior: 'smooth',
      })
    }
  }
  doQuery() {
    const URL = "https://pixabay.com/api/";
    const key = "29184640-266ee5361b73d654bedf55260";
    const { page, searchName } = this.state;
    this.setState({ isLoading: true });
    this.doFetch(URL, key, page, searchName);
  }
  doFetch(URL, key, page, searchName) {
    fetch(`${URL}?q=${searchName}&page=${page}&key=${key}&image_type=photo&orientation=horizontal&per_page=${App.PERPAGE}`)
      .then(resp => resp.json())
      .then(gallery => {
        if (gallery.hits.length === 0) {
          return Promise.reject(new Error("Unfortunately, the search did not yield results!"))
        }
        
        this.handleResponse(gallery);
      })
      .catch(error => { this.setState({ error }) })
      .finally(() => {
        this.setState({ loading: false })
      })
  }
  handleResponse(gallery) {
    this.state.gallery.length === 0 ?
      this.setState({ gallery: gallery.hits, totalItems: gallery.totalHits, isLoading: false, error: null }) :
      this.setState(prev => ({ gallery: [...prev.gallery, ...gallery.hits], isLoading: false, erorr: null }));
  }
  onSubmit = (evt) => {
    evt.preventDefault();
    this.setState({
      searchName: evt.target.elements.searchName.value.trim().toLowerCase(),
      page: 1,
      gallery: [],
    });
    evt.currentTarget.reset();
}
    
  loadMore = () => {
    this.setState(prev => ({ page: prev.page + 1 }))
  }
  toggleModal = (img) => {
    this.setState(prev => ({ showModal: !prev.showModal, currentImg: img }))
  }
  handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) this.toggleModal({})
  }
  handleEsc = (evt) => {
    if (evt.code === 'Escape') this.toggleModal({})
  }

  render() {
    const { gallery, page, totalItems, isLoading, showModal, currentImg, error,  searchName} = this.state;
    if (error) {
      return (
        <div>
          <Searchbar onSubmit={this.onSubmit} />
          <p className="error">Oops . . . !!! &#128579;<br></br> {error.message} </p>
        </div>
      )
    }
    if (!searchName) {
       return (
        <div>
          <Searchbar onSubmit={this.onSubmit} />
          <p className="coment">Enter a search topic!</p>
        </div>
      )
      
    }
    
    return (
      <div>
        <Searchbar onSubmit={this.onSubmit} />
        {isLoading && <Loader />}
        {gallery.length !== 0 &&
          <ImageGallery
            gallery={gallery}
            page={page}
            totalItems={totalItems}
            loadMore={this.loadMore}
            isLoading={isLoading}
            showModal={this.toggleModal} />
        }
        {showModal && <Modal handleOverlayClick={this.handleOverlayClick} onEsc={this.handleEsc} currentImg={currentImg} />}
   
      </div>
    );
  }
}



