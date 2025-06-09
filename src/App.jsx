import { useState, useEffect } from 'react'
import './App.css'
import Search from './components/Search'
import Spiner from './components/Spiner'
import MovieCard from './components/MovieCard';
import Modal from './components/Modal';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

function App() {


  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsOpenedModal(true);
  }

  const closeModal = () => {
    setIsOpenedModal(false);
    setSelectedMovie([]);
  }

  useDebounce(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setDebouncedSearchTerm(searchTerm);
    }
  }, 500, [searchTerm]);

  const fetchMovieDetails = async (movieID = null) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/movie/${movieID}`, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movie details. Please try again later.');
        setMovieDetails([]);
        return;
      }

      setMovieDetails(data);

    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {

      const endpoint =
        query ? `${API_BASE_URL}/search/movie?query=${query}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies. Please try again later.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    }
    catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  useEffect(() => {
      if (selectedMovie.id) {
         fetchMovieDetails(selectedMovie.id);

      }
  }, [selectedMovie]);


  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    if (isOpenedModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenedModal]);


  return (
    <>
      <main>
        <div className="pattern">
          <div className="wrapper">
            <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1>
                Find <span className='text-gradient'>Movies</span>  You'll Enjoy Without the Hassle
              </h1>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>

            {trendingMovies.length > 0 && (
              <section className='trending'>
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className='all-movies'>
              <h2>All movies</h2>
              {isLoading ? (
                <Spiner />
              ) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>) :
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard openModal={openModal} key={movie.id} movie={movie} />
                  ))}
                </ul>}
            </section>
          </div>
        </div>
      </main>
      {isOpenedModal && (
        <Modal onClick={() => setIsOpenedModal(true)} details={movieDetails} closeModal={closeModal} isLoading={isLoading}/>
      )}

    </>
  )
};

export default App;
