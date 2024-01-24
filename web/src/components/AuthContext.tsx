import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: string | null;
  login: (user: string, userId: number, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>( undefined)

export function AuthProvider({children}: AuthProviderProps){
  const [user, setUser] = useState<string | null>(null)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if(storedUser){
      setUser(storedUser)
    }
  },[])

  function login(newUser : string, userId: number, role: string){
    setUser(newUser)
    sessionStorage.setItem('user', newUser)
    sessionStorage.setItem('id', userId.toString())
    sessionStorage.setItem('role', role)
  }

  function logout(){
    setUser(null)
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('id')
    sessionStorage.removeItem('role')
  }

  return(
    <AuthContext.Provider value={{ user, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  const context = useContext(AuthContext)
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}