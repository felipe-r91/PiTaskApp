import { Logo } from "../assets/Logo1";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import { useAuth } from "./AuthContext";


export function Login() {

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  async function submitForm(e : FormEvent){
    //e.preventDefault()
    try {
      const response = await api.post('/userLogin', {
        user,
        password,
      });

      if (response.status === 200) {
        // On successful login, update the user context
        const id = response.data.id
        login(user, id);
        
      }
    } catch (error) {
      console.error('Login failed: Invalid Credentials');
      alert('Credenciais Inválidas')
      setUser('')
      setPassword('')
    }
    
  }

  return (
    <div className="h-[100dvh] w-full bg-off-white">
      <div className="pt-14 pl-36">
        <Logo width={100} />
      </div>
      <div className="flex items-center justify-center">
        <form onSubmit={submitForm} className="w-[500px] h-[600px] mt-[-40px] bg-white shadow-xl rounded-2xl border border-[#E5E5ED] justify-center">
          <div className="text-6xl text-purple-dark flex justify-center font-semibold pt-10">Entrar</div>
          <div className="flex justify-self-auto pt-5 px-10">Agilize suas ordens, conquiste eficiência. Tenha em suas</div>
          <div className="flex justify-center">mãos a solução para a gestão de serviços</div>
          <div className="pt-8 grid justify-center gap-5">
            <fieldset className="grid justify-items-start gap-2">
              <label htmlFor="username" className="text-purple-dark text-lg font-semibold">Usuário</label>
              <input className="w-[400px] rounded-xl text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[55px] flex-1 items-center justify-center px-[10px] text-[20px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                type="text"
                id="username"
                autoComplete="off"
                onChange={e => setUser(e.target.value)}
                required
              >
              </input>
            </fieldset>
            <fieldset className="grid justify-items-start gap-2">
              <label htmlFor="password" className="text-purple-dark text-lg font-semibold">Senha</label>
              <input className="w-[400px] rounded-xl text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[55px] flex-1 items-center justify-center px-[10px] text-[20px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                type="password"
                id="password"
                autoComplete="off"
                onChange={e => setPassword(e.target.value)}
              >
              </input>
            </fieldset>
            <a className="text-purple-light pt-3 hover:underline w-fit" href="/Test">Esqueceu a senha?</a>
            <div className="flex justify-center pt-5">
              <button type="submit" className="w-[300px] h-[50px] flex justify-center items-center bg-[#EDECFE] text-xl text-[#5051F9] hover:bg-[#5051F9] hover:text-white rounded-xl">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="flex justify-center">
        <div className="flex items-center justify-start gap-10 pt-10">
          <div className="text-purple-dark text-[17px]">
            Novo no TaskGO!?
          </div>
          <a className="text-purple-light hover:underline text-[17px]" href="/SignIn">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  )
}