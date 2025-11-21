import React, { createContext, useContext } from 'react';

const BackendURLContext = createContext();

export const BackendURLProvider = ({ children }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    return (
        <BackendURLContext.Provider value={backendURL}>
            {children}
        </BackendURLContext.Provider>
    );
};

export const useBackendURL = () => useContext(BackendURLContext);