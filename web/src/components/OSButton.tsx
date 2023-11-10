import { Transition } from "@headlessui/react"
import { useState } from "react"
import { AvatarColab } from "../assets/AvatarColab";

interface OSProps {
  soNumber: number;
  soCostumer: string;
  soColab ?: string [];
  colabAvatar : string;
}


export function OSButton(props: OSProps){

  
  const [isShowing, setIsShowing] = useState(false)
  

  return (
    <>
    <button type='button' onClick={() => setIsShowing((isShowing)=> !isShowing)} title='Order details' className="flex w-80 h-16 bg-purple-light rounded-xl shadow-custom justify-between items-center px-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110">
      <div className=" text-white text-xl font-semibold">OS {props.soNumber} - {props.soCostumer}</div>
    </button>
    <Transition
      show={isShowing}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
        <div className="h-px w-80 bg-[#E8EDF1]"></div>
        <div className="text-purple-xdark font-bold text-xl py-5" >
          Colaboradores
        </div>
        
        <div className="py-2 gap-2 flex">
          <AvatarColab width="w-[45px]" height="h-[45px]" img={props.colabAvatar} name=""/>
          <div className="grid grid-rows-2">
          <div className="text-purple-xdark text-base font-bold">Cleber</div>
          <div className="text-[#768396] text-base font-semibold">Técnico Refrigeração</div>
          </div>
        </div>

        <div className="py-2 gap-2 flex">
          <AvatarColab width="w-[45px]" height="h-[45px]" img={props.colabAvatar} name=""/>
          <div className="grid grid-rows-2">
          <div className="text-purple-xdark text-base font-bold">Cleber</div>
          <div className="text-[#768396] text-base font-semibold">Técnico Refrigeração</div>
          </div>
        </div>
      </Transition>
    </>
  )

}