import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';

import StartRating from './StarRating';

















////////////////////////////////////////////////////////////////////////////////////////////


// to make comp more customizable the functios has to be added outside root, must have it's own state

// update state info by passing them using prop drilling and handling funtions.

/*

function Test() {
  const [movieRating, setMovieRating] = useState();

  return(
    <div>
      <StartRating color="blue" maxRating={10} onSetRating={setMovieRating}/>
      <p>This movie was rated {movieRating} starts</p>
    </div>
  )
}

*/
/*

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   {/*<App />*//*} 
    <StartRating maxRating={5} messagess={["Terrible", "Bad", "Okay", "Good", "Amazing"]}/>
    <StartRating size={24} color="red" className="test"/>
    <Test />
  </React.StrictMode>
);

*/