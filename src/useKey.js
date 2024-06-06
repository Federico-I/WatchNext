import { useEffect } from "react";

export function useKey(key, keyAction) {

useEffect(
    function() {

      function listenESC (e) {
        if(e.code.toLowerCase() === key.toLowerCase()) {
          keyAction();
        }
      };

    document.addEventListener("keydown", listenESC);

    return function() {
      document.removeEventListener("keydown", listenESC)
    };

  }, [key, keyAction]); 

};