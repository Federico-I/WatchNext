import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, keyItem) {

    const [valueWatched, setValueWatched] = useState(function () {

        const localStoredValue = localStorage.getItem(keyItem); 
        return localStoredValue ? JSON.parse(localStoredValue) : initialState;
      });

      useEffect( 
        function() {
          localStorage.setItem(keyItem, JSON.stringify(valueWatched));
        }, 
          [valueWatched, keyItem]
      );

      return [valueWatched, setValueWatched];
};