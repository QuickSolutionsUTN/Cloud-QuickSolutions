import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient.js';
import axios from 'axios';
import { set } from 'react-hook-form';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const singInWithEmail = async (email, password) => {

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError) throw authError;
    if (!authData.user || !authData.session) {
      throw new Error("No se pudo obtener la sesión del usuario.");
    }

    const userId = authData.user.id;

    const { data: profileData, error: profileError } = await supabase
      .from('perfiles')
      .select('rol, nombre, apellido')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error("Error al obtener perfil:", profileError);
      throw new Error("Error al cargar el perfil del usuario.");
    }

    if (!profileData) {
      throw new Error("No se encontró un perfil para este usuario.");
    }

    return { role: profileData.rol };

  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {

    const { data: { subscription } } = supabase.auth.onAuthStateChange(

      async (_event, session) => {

        if (session) {
          try {
            const { data: profileData, error } = await supabase
              .from('perfiles')
              .select('rol, nombre, apellido')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error("Error al buscar perfil, deslogueando:", error);
              setProfile(null);
              await supabase.auth.signOut();
              setSession(null);
            } else {
              setProfile(profileData);
              setSession(session);
            }
          } catch (e) {
            console.error("Error grave al buscar perfil:", e);
            setProfile(null);
            setSession(null);
          } finally {
            setLoading(false);
          }
        } else {
          setProfile(null);
          setSession(null);
          setLoading(false);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const user = session ? {
    id: session.user.id,
    email: session.user.email,
    token: session.access_token,
    ...profile
  } : null;

  const value = {
    session,
    user,
    isAuthenticated: !!session, // Derivado, no un estado
    userRole: profile?.rol,
    singInWithEmail,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;