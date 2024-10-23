import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role');
  });
  //const [username, setUsername] = useState('');

  const login = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    //setUsername(user.username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('role', userRole);
    //localStorage.setItem('username', user.username);
  };

//prueba
  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUsername('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    //localStorage.removeItem('username');
  };

  useEffect(() => {
    console.log("Estado: ", isAuthenticated);
    console.log("Rol: ", role);
  }, [isAuthenticated, role]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, /*username,*/ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;