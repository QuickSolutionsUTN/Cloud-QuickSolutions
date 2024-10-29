import React, { createContext, useContext } from 'react';

const BackendURLContext = createContext();

export const BackendURLProvider = ({ children }) => {
    const backendURL = 'https://localhost:7216/api';
    return (
        <BackendURLContext.Provider value={backendURL}>
            {children}
        </BackendURLContext.Provider>
    );
};

export const useBackendURL = () => useContext(BackendURLContext);