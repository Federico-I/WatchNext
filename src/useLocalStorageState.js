import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, keyItem) {

    const [valueWatched, setValueWatched] = useState(function () {
        const localSavedValue = localStorage.getItem(keyItem) 
        return JSON.parse(localSavedValue);
      });

      useEffect( 
        function() {
          localStorage.setItem(keyItem, JSON.stringify(valueWatched));
        }, 
          [valueWatched, keyItem]
      );

      return [valueWatched, setValueWatched];
};