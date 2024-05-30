import { useState } from "react";
import { useEffect } from "react";
import StartRating from "./StarRating.js";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];


////////////////// movie API KEY ///////////////////////

const KEY = `${process.env.OMDB_API_KEY}`;


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


//////////////////////////////////////////////////////////
//                       APP
//////////////////////////////////////////////////////////

export default function App() {

  const [query, setQuery] = useState("terminator");

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] =useState("");
  const [selectedID, setSelectedID] = useState(null);



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

  useEffect(function () {
    async function fetchMovies() {
      try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);

      if (!res.ok)
        throw new Error("Somthing went wring with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
      setMovies(data.Search);
      } catch (err) {
      console.error(err.message);
      setError(err.message);
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();
  }, [query]);

  
  return(
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <FoundCounter movies={movies}/>
      </NavBar>
      <Main>
        <List>
          {/*isLoading ? <Loading /> : <MovieList movies={movies}/>*/}
          {isLoading && <Loading/>}
          { !isLoading && !error && 
            <MovieList movies={movies} onSelectedID={handleSelectID} />}
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
  )

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

  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
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
    <>
      <main className="main">
        {children}
      </main>
    </>
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
  const [personalRating, setPersonalRating] = useState();

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);

  const userRated = watched.find((movie) => movie.imdbID === selectedID)?.userRating;

  const {Title: title, Year: year, Poster: poster, RunTime: runtime, imdbRating, Plot: plot, Relesed: released, Actors: actors, Director: director, Genre: genre} = movieInfo;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split("").at(0)),
      personalRating,
    }

    onAddWatched(newWatchedMovie);
    onCloseSelected();
  };

  useEffect(function() {
    async function getMovieDetails(){
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
      );

      const data = res.json();
      console.log(data);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedID]);

  useEffect(function () {

    if(!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "2Watch";
    } // Cleaning Function
  }, [title]);

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




















///////////////////////////////////////////////////////////////////////////////////////////

/*

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


 ////////////////////////////////////////////////
 //           App Comp
 /////////////////////////////////////////////////

export default function App() {

  const [movies, setMovies] = useState(tempMovieData);

  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <>
      <NavbarWatch>
        
        <SearchInput />
        <Results movies={movies} />
      </NavbarWatch>
      <MainComp>
        <BoxBox  >
          <MoviesList movies={movies}/>
        </BoxBox >
        <BoxBox >
          <TotalWatchedInfo watched={watched} />
          <AlreadyWatched watched={watched} />
        </BoxBox >
      </MainComp>
    </>
  );
};

 ////////////////////////////////////////////////
 //            Nav and small Comp
 /////////////////////////////////////////////////

function NavbarWatch({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  )
};


function Logo() {
  return(
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
};


function SearchInput() {
  const [query, setQuery] = useState("");
  return(
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
};


function Results({ movies }) {
  return(
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
};

 ////////////////////////////////////////////////
 //              Main Comp
 /////////////////////////////////////////////////

function MainComp({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  )
};


function BoxBox ({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return(
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  )
};


function MoviesList({ movies }) {
  
  return(
    <ul className="list">
      {movies?.map((movie) => (
        <MovieItem movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
};


function MovieItem({ movie }) {
  return(
    <li >
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

 ////////////////////////////////////////////////
 //             Watched List Comp
 /////////////////////////////////////////////////
/*
function WatchedBox({ children }) {

  const [isOpen2, setIsOpen2] = useState(true);
  return(
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
      {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && children}
    </div>
  )
};
*/

/*

function TotalWatchedInfo({ watched }) {
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
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
};

 ////////////////////////////////////////////////
 //           Already Watched
 /////////////////////////////////////////////////

function AlreadyWatched({ watched }) {
  return(
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieItem movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
};


function WatchedMovieItem({ movie }) {
  return(
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
      </div>
    </li>
  )
};

*/