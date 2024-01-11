import { Logo } from "../assets/Logo1";


export function Login() {
  return (
    <div className="h-[100dvh] w-full bg-white">
      <div className="pt-14 pl-36">
        <Logo width={100} />
      </div>
      <div className="flex items-center justify-center">
        <form className="w-[500px] h-[600px] mt-[-40px] bg-white shadow-xl rounded-2xl border border-[#E5E5ED] justify-center">
          <div className="text-6xl text-purple-dark flex justify-center font-semibold pt-10">Entrar</div>
          <div className="flex justify-self-auto pt-5 px-10">Agilize suas ordens, conquiste eficiência. Tenha em suas</div>
          <div className="flex justify-center">mãos a solução para a gestão de serviços</div>
          <div className="pt-8 grid justify-center gap-5">
            <fieldset className="grid justify-items-start gap-2">
              <label htmlFor="username" className="text-purple-dark text-lg font-semibold">Usuário</label>
              <input className="w-[400px] rounded-xl text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[55px] flex-1 items-center justify-center px-[10px] text-[20px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                type="text"
                id="username"
                required
              >
              </input>
            </fieldset>
            <fieldset className="grid justify-items-start gap-2">
              <label htmlFor="password" className="text-purple-dark text-lg font-semibold">Senha</label>
              <input className="w-[400px] rounded-xl text-[#768396] shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[55px] flex-1 items-center justify-center px-[10px] text-[20px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                type="text"
                id="password"
              >
              </input>
            </fieldset>
            <div className="text-purple-light pt-3">Esqueceu a senha?</div>
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
          <div className="text-[#0a66c2] text-[17px]">
            Cadastre-se
          </div>
        </div>

      </div>
    </div>
  )
}