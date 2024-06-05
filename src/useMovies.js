import { useState, useEffect } from "react";


////////////////// movie API KEY ///////////////////////

  const KEY = `${process.env.OMDB_API_KEY}`;

/////////////////////////////////////////
//          Movie Hook
/////////////////////////////////////////

  export function useMovies(query) {

  const [displayMovies, setDisplayMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] =useState("");

    
  useEffect(
    function () {
      const controller = new AbortController();
    
      async function fetchMovies() {

      try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });

      if (!res.ok)
        throw new Error("Somthing went wring with fetching movies");

      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not found");

      setDisplayMovies(data.Search);
      setError("");

      } catch (err) {

        if(err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }

      setError(err.message);
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setDisplayMovies([]);
      setError("");
      return;
    }

    // handleCloseSelected();
    fetchMovies();

    return function(){
      controller.abort();
    }
  }, [query]);

  return {displayMovies, isLoading, error};
};