import { createContext, useState } from "react";

export const Data = createContext(null);

function Context({ children }) {
    const [data, setData] = useState();

    return (
        <Data.Provider value={{ data, setData }}>
            {children}
        </Data.Provider>
    );
}

export default Context