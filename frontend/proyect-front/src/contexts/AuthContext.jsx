import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.jsx';
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
    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);

      if (session) {
        const { data: profileData } = await supabase
          .from('perfiles')
          .select('rol, nombre, apellido')
          .eq('id', session.user.id)
          .single();

        setProfile(profileData);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          setLoading(true);
          const { data: profileData } = await supabase
            .from('perfiles')
            .select('rol, nombre, apellido')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
          setLoading(false);
        } else {
          setProfile(null);
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
    isAut,
    isAuthenticated: !!session, // Derivado, no un estado
    userRole: profile?.rol,
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