import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(
    localStorage.getItem('authToken') || null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') !== null;
  });
  const [userRole, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('email') || null;
  });


  const login = (userData) => {
    console.log("datos del usuario: " ,userData);
    
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('email', userData.email);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('authToken', userData.token);

    setIsAuthenticated(true);
    setRole(userData.role);
    setUserEmail(userData.email);
    setUserToken(userData.token);

    console.log("Usuario autenticado correctamente");
  };

  //prueba
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setUserToken(null); 
    setRole(null); 
    setUserEmail(null);
    console.log("Usuario desautenticado correctamente");
  };

  useEffect(() => {
    console.log("Estado: ", isAuthenticated);
    console.log("Rol: ", userRole);
    console.log("Email: ", userEmail);
  }, [isAuthenticated, userRole, userEmail]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;