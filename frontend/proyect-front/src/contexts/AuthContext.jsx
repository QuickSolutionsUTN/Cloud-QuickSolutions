import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useBackendURL } from './BackendURLContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const backendURL = useBackendURL();
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem('refreshToken') || null;
  });

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      console.error("Error al decodificar el token");
      return false;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return isTokenValid(userToken);
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
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('name') || null;
  });
  const [userSurName, setUserSurName] = useState(() => {
    return localStorage.getItem('surName') || null;
  });


  const login = (userData) => {
    console.log("datos del usuario: ", userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('email', userData.email);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('surName', userData.surName);

    setIsAuthenticated(true);
    setRole(userData.role);
    setUserEmail(userData.email);
    setUserToken(userData.token);
    setUserId(userData.userId);
    setRefreshToken(userData.refreshToken);
    setUserName(userData.name);
    setUserSurName(userData.surName);

    console.log("Usuario autenticado correctamente");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('surName');
    setUserToken(null);
    setRole(null);
    setUserEmail(null);
    setUserId(null);
    setRefreshToken(null);
    setUserName(null);
    setUserSurName(null);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      const response = await axios.post(`${backendURL}/api/users/refresh-token`, {
        refreshToken: refreshToken,
      });
      const accessToken = response.data.token;
      setUserToken(accessToken);
      localStorage.setItem('authToken', accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      logout(); // Cerrar sesión si el refresh token no es válido
    }
  };

  useEffect(() => {
    // Si el token de acceso está presente, pero es inválido
    if (userToken && !isTokenValid(userToken)) {
      console.log("Access token expirado, intentando refrescar...");
      console.log("Refresh token: ", refreshToken);
      // Intentar refrescar el access token con el refresh token
      refreshAccessToken();
    }
  }, [userToken]);

  /*useEffect(() => {
    console.log("Estado: ", isAuthenticated);
    console.log("Rol: ", userRole);
    console.log("Email: ", userEmail);
    console.log("UserId: ", userId);
    console.log("Token: ", userToken);
    console.log("Nombre: ", userName);
    console.log("Apellido: ", userSurName);
  }, []);*/

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail, userToken, refreshToken, userId, userName, userSurName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;