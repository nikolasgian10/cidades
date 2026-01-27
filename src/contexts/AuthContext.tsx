import { createContext, useContext, useState, ReactNode } from "react";

type UserType = "pessoa_fisica" | "pessoa_juridica";

interface User {
  id: string;
  nome: string;
  email: string;
  cpfCnpj: string;
  tipo: UserType;
  role: "cidadao" | "atendente" | "recepcionista" | "gestor" | "admin";
  secretaria?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (cpfCnpj: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cidade_online_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (cpfCnpj: string, password: string): Promise<boolean> => {
    // Mock login - substituir por autenticação real com Lovable Cloud
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Remove formatação para comparação
    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");
    const cleanPassword = password.replace(/\D/g, "");
    
    // Verifica se a senha é igual ao CPF/CNPJ (apenas números)
    if (cleanPassword !== cleanCpfCnpj) {
      // Em produção, validar no backend
      // Por enquanto, aceita qualquer senha para demo
    }
    
    // Determina se é PF ou PJ pelo tamanho
    const isPJ = cleanCpfCnpj.length === 14;
    
    const mockUser: User = {
      id: "1",
      nome: isPJ ? "Empresa Teste LTDA" : "Usuário Teste",
      email: isPJ ? "empresa@email.com" : "usuario@email.com",
      cpfCnpj: cleanCpfCnpj,
      tipo: isPJ ? "pessoa_juridica" : "pessoa_fisica",
      role: "cidadao",
    };
    
    setUser(mockUser);
    localStorage.setItem("cidade_online_user", JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cidade_online_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
