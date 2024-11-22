import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextProps {
  nomeUsuario: string | null;
  setNomeUsuario: (name: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ nomeUsuario, setNomeUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
