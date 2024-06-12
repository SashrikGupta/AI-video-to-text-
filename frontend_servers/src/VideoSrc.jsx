import React, { createContext, useContext, useState, useEffect } from "react";

export const curr_context = createContext();

export default function VSRC(props) {
          
    const [vsrc , set_vsrc] = useState() ; 

    return(
      <>
       < curr_context.Provider value = {{ vsrc , set_vsrc}}>
        {props.children}
       </curr_context.Provider>
      </>
    )

}
