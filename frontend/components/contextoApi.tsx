import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  nome: string | null;
  email: string | null;
  cpf: string | null;
  endereco:any;
  contato: any;
  reserva: any;
  avaliacao: any;
  role:any;
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    };

    loadAuthData();
  }, []);

  const setAuthData = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    await AsyncStorage.setItem('jwt_token', newToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  const clearAuthData = async () => {
    setToken(null);
    setUser(null);

    await AsyncStorage.removeItem('jwt_token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
