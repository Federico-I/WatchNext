import { useState, useEffect, useRef } from "react";
import StartRating from "./StarRating.js";
import { useMovies } from "./useMovies.js";
import { useLocalStorageState } from "./useLocalStorageState.js";
import { useKey } from "./useKey.js";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

////////////////// movie API KEY ///////////////////////
const KEY = process.env.REACT_APP_OMDB_API_KEY;

//////////////////////////////////////////////////////////
//                       APP
//////////////////////////////////////////////////////////
export default function App() {

  const [query, setQuery] = useState("");
  const {displayMovies, isLoading, error} = useMovies(query);
  const [selectedID, setSelectedID] = useState(null);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  //////////////////////////////////////////////
  //             function-handle
  ///////////////////////////////////////////////

  function handleSelectID(id) {
    setSelectedID(selectedID => (id === selectedID ? null : id ));
  };

  function handleCloseSelected(){
    setSelectedID(null);
  };

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  };

  function handleDeleteWatched(movieID){
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== movieID));
  };

  //////////////////////////////////////////////
  //              API-fetch
  ///////////////////////////////////////////////
  return(
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <FoundCounter movies={displayMovies}/>
      </NavBar>
      <Main>
        <List>
          {isLoading && <Loading/>}
          { !isLoading && !error && 
            <MovieList movies={displayMovies} onSelectedID={handleSelectID} />}
          {error && <Error message={error} />}
        </List>
        <List >
          { 
            selectedID ? 
              <MovieSummary selectedID={selectedID} onCloseSelected={handleCloseSelected} onAddWatched={handleAddWatched} watched={watched}/> : <>
              <WatchedStats watched={watched}/>
              <WatchedMovies watched={watched} onDelete={handleDeleteWatched}/>
          </>}
        </List>
      </Main>
    </>
  );
};

//////////////////////////////////////////////////////////
//                    LoadingComp
//////////////////////////////////////////////////////////
function Loading() {
  return(
    <p className="loader">Loading...</p>
  )
};

//////////////////////////////////////////////////////////
//                    ErrorComp
//////////////////////////////////////////////////////////
function Error({ message }) {
  return(
    <p className="error">
      <span>X</span>{message}
    </p>
  )
};

//////////////////////////////////////////////////////////
//                       NavBar
//////////////////////////////////////////////////////////
function NavBar({ children }) {
  return(
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
  )
};

//////////////////////////////////////////////////////////
//                     Search Bar
//////////////////////////////////////////////////////////
function Search({ query, setQuery }) {
  const focusEl = useRef(null);

  useKey("Enter", function() {
    if(document.activeElement === focusEl.current) return;
    focusEl.current.focus();
    setQuery("");
  });

  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={focusEl}
  />
  )
};

//////////////////////////////////////////////////////////
//                       Logo
//////////////////////////////////////////////////////////
function Logo() {
  return(
    <div className="logo">
      <span role="img">🍿</span>
      <h1>2Watch</h1>
    </div>
  )
};

//////////////////////////////////////////////////////////
//                   FoundCounter
//////////////////////////////////////////////////////////
function FoundCounter({ movies }) {
  return(
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
};

//////////////////////////////////////////////////////////
//                       Main
//////////////////////////////////////////////////////////
function Main({ children }) {
  return (
      <main className="main">
        {children}
      </main>
  );
};

//////////////////////////////////////////////////////////
//                     ListComp
//////////////////////////////////////////////////////////
function List({ children }) {
  const [isOpen, setIsOpen1] = useState(true);

  return(
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
};

//////////////////////////////////////////////////////////
//                     MovieList
//////////////////////////////////////////////////////////
function MovieList({ movies, onSelectedID}) {
  return(
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieCompList movie={movie} key={movie.imdbID} onSelectedID={onSelectedID}/>
      ))}
    </ul>
  )
};

//////////////////////////////////////////////////////////
//                     MovieComp
//////////////////////////////////////////////////////////
function MovieCompList({ movie, onSelectedID }) {
  return(
    <li onClick={() => onSelectedID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
};

//////////////////////////////////////////////////////////
//                  MovieSummary
//////////////////////////////////////////////////////////
function MovieSummary({ selectedID, onCloseSelected, onAddWatched, watched }) {
  const [movieInfo, setMovieInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [personalRating, setPersonalRating] = useState("");

  const countRateRef = useRef(0);

  useEffect(
    function() {
      if (personalRating) countRateRef.current = countRateRef.current + 1;
  }, [personalRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const userRated = watched.find((movie) => movie.imdbID === selectedID)?.userRating;

  const {Title: title, Year: year, Poster: poster, RunTime: runtime, imdbRating, Plot: plot, Relesed: released, Actors: actors, Director: director, Genre: genre} = movieInfo;

  const isTop = imdbRating > 8;
  
  // const [userAvgRating, setUserAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split("").at(0)),
      personalRating,
      countRateRefDecisions: countRateRef.current,
    }

    onAddWatched(newWatchedMovie);
    onCloseSelected();
  };

  ////////////////////////////////////
  //    Cucstom Hook "ESC" key
  ///////////////////////////////////
  useKey("Escape", onCloseSelected);

  useEffect(
    function() {

    async function getMovieDetails(){
      setIsLoading(true);

      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&${selectedID}`
      );

      const data = await res.json();
      setMovieInfo(data);
      setIsLoading(false);
    }

    getMovieDetails();
    }, [selectedID]
  );

  ///////////////////////////////////////////////
  //  Chnage browser tab name to movie-title
  ///////////////////////////////////////////////
  useEffect(function () {

    if(!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "2Watch";
    }
    
    }, [title]
  );
  ///////////////////////////////////////////////

  return(
    <div className="detail">
      { isLoading ? ( <Loading /> ) : ( 
        <>
          <header>
            <button className="btn-back" onClick={onCloseSelected}>
              &larr;
            </button>
            <img src={poster} alt={`Psoter of movie ${movieInfo}`}/>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p><span>*</span>{imdbRating} IMDB Rating</p>
            </div>
          </header>

          {/*<p>{userAvgRating}</ p>*/} 

          <section>
            <div className="rating">
              { !isWatched ? 
                <>
                  <StartRating maxRating={10} size={24} onSetRating={setPersonalRating}/>

                  {personalRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add movie
                    </button>
                  )};
                </>
              : <p>Movie already rated with {userRated}! </p>}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )};
    </div>
  )
};

//////////////////////////////////////////////////////////
//                      Watched
//////////////////////////////////////////////////////////
function WatchedStats({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return(
    <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
            </p>
            <p>
              <span>⭐️</span>
              <span>{avgImdbRating.toFixed(2)}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{avgUserRating.toFixed(2)}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{avgRuntime} min</span>
            </p>
        </div>
    </div>
  )
}

//////////////////////////////////////////////////////////
//                    RateWatched
//////////////////////////////////////////////////////////
function WatchedMovies({ watched, onDelete }) {
  return(
    <ul className="list">
      {watched.map((movie) => (
        <MovieItem movie={movie} key={movie.imdbID} onDelete={onDelete}/>
      ))}
    </ul>
  )
};

//////////////////////////////////////////////////////////
//                    MovieComp
//////////////////////////////////////////////////////////
function MovieItem({ movie, onDelete }) {
  return(
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>X</button>
      </div>
    </li>
  )
};
