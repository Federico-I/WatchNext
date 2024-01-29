import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';

import StartRating from './StarRating';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   {/*<App />*/}
    <StartRating maxRating={5} messagess={["Terrible", "Bad", "Okay", "Good", "Amazing"]}/>
    <StartRating size={24} color="red" className="test"/>
  </React.StrictMode>
);

