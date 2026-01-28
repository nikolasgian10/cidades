import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type UserType = "pessoa_fisica" | "pessoa_juridica";

interface User {
  id: string;
  nome: string;
  email: string;
  cpfCnpj?: string;
  tipo?: UserType;
  role?: "cidadao" | "atendente" | "recepcionista" | "gestor" | "admin";
  secretaria?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup?: (email: string, password: string, full_name?: string, cpf_cnpj?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cidade_online_user");
    return saved ? JSON.parse(saved) : null;
  });

  const mapProfileToUser = (profile: any): User => {
    return {
      id: profile.id,
      nome: profile.full_name ?? "",
      email: profile.email ?? "",
      cpfCnpj: profile.cpf_cnpj ?? profile.cpfCnpj ?? undefined,
      role: profile.role ?? "cidadao",
      secretaria: profile.secretaria ?? undefined,
    };
  };

  const fetchProfile = async (authUserId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUserId)
      .single();

    if (error) {
      return null;
    }
    return profile;
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const getUserRes = await supabase.auth.getUser();
        const currentUser = getUserRes?.data?.user ?? null;

        if (!mounted) return;

        if (currentUser) {
          const profile = await fetchProfile(currentUser.id);
          if (profile) {
            const mapped = mapProfileToUser(profile);
            setUser(mapped);
            localStorage.setItem("cidade_online_user", JSON.stringify(mapped));
          } else {
            const basic: User = {
              id: currentUser.id,
              nome: (currentUser.user_metadata as any)?.full_name ?? "Usuário",
              email: currentUser.email ?? "",
              role: "cidadao",
            };
            setUser(basic);
            localStorage.setItem("cidade_online_user", JSON.stringify(basic));
          }
        } else {
          setUser(null);
          localStorage.removeItem("cidade_online_user");
        }
      } catch (err) {
        console.error("init auth error:", err);
      }
    };

    init();

    // Subscribes to auth state changes. Guard contra estruturas diferentes retornadas pela lib.
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const authUser = session?.user ?? null;
        if (authUser) {
          const profile = await fetchProfile(authUser.id);
          if (profile) {
            const mapped = mapProfileToUser(profile);
            setUser(mapped);
            localStorage.setItem("cidade_online_user", JSON.stringify(mapped));
          } else {
            const basic: User = {
              id: authUser.id,
              nome: (authUser.user_metadata as any)?.full_name ?? "Usuário",
              email: authUser.email ?? "",
              role: "cidadao",
            };
            setUser(basic);
            localStorage.setItem("cidade_online_user", JSON.stringify(basic));
          }
        } else {
          setUser(null);
          localStorage.removeItem("cidade_online_user");
        }
      } catch (err) {
        console.error("onAuthStateChange handler error:", err);
      }
    });

    // Cleanup seguro: data pode ser undefined dependendo da versão da lib
    return () => {
      mounted = false;
      try {
        // data?.subscription?.unsubscribe() — funciona nas versões que retornam subscription
        // Alguns ambientes retornam diretamente a função unsubscribe; tenta ambos
        // @ts-ignore
        if (data?.subscription?.unsubscribe) data.subscription.unsubscribe();
        // @ts-ignore
        else if (typeof data?.unsubscribe === "function") data.unsubscribe();
      } catch (err) {
        // nothing to do — evita crash no cleanup
      }
    };
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      let email = identifier.trim();
      if (!email.includes("@")) {
        const clean = identifier.replace(/\D/g, "");
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("cpf_cnpj", clean)
          .single();

        if (error || !data?.email) {
          return false;
        }
        email = data.email;
      }

      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !signInData.user) {
        return false;
      }

      const profile = await fetchProfile(signInData.user.id);
      if (profile) {
        const mapped = mapProfileToUser(profile);
        setUser(mapped);
        localStorage.setItem("cidade_online_user", JSON.stringify(mapped));
      } else {
        const basic: User = {
          id: signInData.user.id,
          nome: (signInData.user.user_metadata as any)?.full_name ?? "Usuário",
          email: signInData.user.email ?? "",
          role: "cidadao",
        };
        setUser(basic);
        localStorage.setItem("cidade_online_user", JSON.stringify(basic));
      }

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("cidade_online_user");
  };

  const signup = async (email: string, password: string, full_name?: string, cpf_cnpj?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name } },
      });

      if (error || !data.user) return false;

      const profileInsert = {
        id: data.user.id,
        full_name: full_name ?? "",
        email,
        cpf_cnpj: cpf_cnpj ?? null,
        role: "cidadao",
      };

      const { error: insertError } = await supabase.from("profiles").insert([profileInsert]);
      if (insertError) {
        console.error("Erro ao criar profile:", insertError);
      }

      return true;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
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