import { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient.js';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const signInWithEmail = async (email, password) => {

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
    setSession(authData.session);
    setProfile(profileData);
    return { role: profileData.rol };

  };

  const signUpWithEmail = async (email, password, profile) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: profile.nombre,
          apellido: profile.apellido,
          fecha_de_nacimiento: profile.fechaNacimiento,
          rol: profile.rol || 'cliente'
        }
      }
    });

    if (signUpError) {
      console.error('Error en signUp:', signUpError);
      throw signUpError;
    }

    return { user: signUpData.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(

      async (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {

    if (!session) {
      console.log("AuthContext: No hay sesión, perfil es null.");
      setProfile(null);
      return;
    }
    const fetchProfile = async () => {
      setProfileLoading(true);

      try {
        const { data, error } = await supabase
          .from('perfiles')
          .select('rol, nombre, apellido')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        console.log("AuthContext: Perfil encontrado:", data);
        setProfile(data);

      } catch (e) {
        console.error("AuthContext: No se pudo buscar el perfil", e);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const user = session ? {
    id: session.user.id,
    email: session.user.email,
    token: session.access_token,
    ...profile
  } : null;

  const value = {
    session,
    user,
    userToken: session?.access_token,
    isAuthenticated: !!session, // Derivado, no un estado
    userRole: profile?.rol,
    userName: profile?.nombre,
    userSurName: profile?.apellido,
    signInWithEmail,
    signUpWithEmail,
    resetPasswordForEmail,
    logout,
    loading,
    profileLoading
  };

  const resetPasswordForEmail = async (email) => {
    const redirectToUrl = `${window.location.origin}/update-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectToUrl,
    });
    
    if (error) {
        if (error.status === 404) {
            throw new Error("Si el correo electrónico existe, recibirá un enlace para restablecer su contraseña.");
        }
        throw error;
    }
    
    return { message: 'Password reset email sent' };
};

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;