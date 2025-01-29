import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') !== null;
  });
  const [userRole, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('email') || null;
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });


  const login = (userData) => {
    console.log("datos del usuario: " ,userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('email', userData.email);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userId', userData.userId);

    setIsAuthenticated(true);
    setRole(userData.role);
    setUserEmail(userData.email);
    setUserToken(userData.token);
    setUserId(userData.userId);

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
    setUserId(null);
    console.log("Usuario desautenticado correctamente");
  };

  useEffect(() => {
    console.log("Estado: ", isAuthenticated);
    console.log("Rol: ", userRole);
    console.log("Email: ", userEmail);
    console.log("UserId: ", userId);
    console.log("Token: ", userToken);
  }, [isAuthenticated, userRole, userEmail]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail,userToken,userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;